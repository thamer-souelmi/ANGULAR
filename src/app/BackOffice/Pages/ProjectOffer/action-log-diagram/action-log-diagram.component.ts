import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { ActionLogService } from "../../../../Services/action-log.service";
import { QuoteService } from 'src/app/Services/quote.service';
import { Quote } from 'src/app/Models/quote';
import { ScaleOrdinal } from 'd3-scale'; // Import ScaleOrdinal
import { InternMap } from 'd3-array'; // Import InternMap
import {transition} from 'd3-transition'

interface NodeDatum extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  children?: NodeDatum[]; // Define children property
}

const groupedLogs: GroupedLogs = {};

interface GroupedLogs {
  [key: number]: any[]; // This allows numbers as keys and arrays of any type as values
}

@Component({
  selector: 'app-action-log-diagram',
  templateUrl: './action-log-diagram.component.html',
  styleUrls: ['./action-log-diagram.component.css']
})
export class ActionLogDiagramComponent implements OnInit {
  @ViewChild('actionLogDiagram', { static: true }) actionLogDiagram!: ElementRef;
  private simulation: any;
  private entityname!: String;
  public nodes: NodeDatum[] = [];
  private links: any[] = [];
  entityIds: { id: number, label: string }[] = []; // Store entityIds and labels as objects
  selectedEntityId: number | null = null; // Store the selected entityId

  quote: Quote = new Quote();
  private currentSvgIndex: number = 0;


  constructor(private actionLogService: ActionLogService, private quoteservice: QuoteService) { }

  ngOnInit() {
    const ordinalScale: ScaleOrdinal<any, any> = d3.scaleOrdinal(); // Using ScaleOrdinal

    this.actionLogService.getEntityIds().subscribe(entityIds => {
      this.entityIds = entityIds.map(id => ({ id, label: `SVG ${id}` }));

      // Iterate over entity IDs and generate diagrams
      this.generateDiagramsSequentially(); // Start generating diagrams sequentially
    });
  }
  generateDiagramsSequentially() {
    setInterval(() => {
      if (this.selectedEntityId !== null) {
        // Clear previous diagram
        d3.select(this.actionLogDiagram.nativeElement).selectAll('*').remove();

        // Fetch data and generate diagram for the selected entityId
        this.fetchDataAndGenerateDiagram(this.selectedEntityId);

        // Find the index of the selected entityId
        this.currentSvgIndex = this.entityIds.findIndex(entity => entity.id === this.selectedEntityId);

        // Move to the next diagram index
        this.currentSvgIndex = (this.currentSvgIndex + 1) % this.entityIds.length;
        // Reset the selected entityId
        this.selectedEntityId = null;
      }
    }, 2000); // Interval of 2 seconds between each diagram
  }
  // generateDiagramsSequentially(entityIds: number[]) {
  //   setInterval(() => {
  //     // Clear previous diagram
  //     d3.select(this.actionLogDiagram.nativeElement).selectAll('*').remove();

  //     // Fetch data and generate diagram
  //     this.fetchDataAndGenerateDiagram(entityIds[this.currentSvgIndex]);

  //     // Move to the next diagram index
  //     this.currentSvgIndex = (this.currentSvgIndex + 1) % entityIds.length;
  //   }, 10000); // Interval of 2 seconds between each diagram
  // }

  // fetchDataAndGenerateDiagram(entityId: number) {
  //   this.actionLogService.getActionLogsForEntity(entityId).subscribe(actionLogs => {
  //     // Initialize nodes and links arrays for this diagram
  //     this.nodes = [];
  //     this.links = [];

  //     // Process fetched action logs to create nodes and links arrays
  //     actionLogs.forEach((log, index) => {
  //       const newNode: NodeDatum = { id: `ActionLog_${log.id}`, label: `${log.action} - ${log.entityName}` };
  //       this.nodes.push(newNode);
  //       this.entityname = log.entityName;
  //       // Assuming you want to link actions based on their sequence
  //       if (index > 0) {
  //         const newLink = {
  //           source: `ActionLog_${actionLogs[index - 1].id}`,
  //           target: `ActionLog_${log.id}`
  //         };
  //         this.links.push(newLink);
  //       }
  //     });

  //     // Generate the diagram after updating nodes and links
  //     this.generateActionLogDiagram();
  //   });
  // }

  fetchDataAndGenerateDiagram(entityId: number) {
    this.actionLogService.getActionLogsForEntity(entityId).subscribe(actionLogs => {
      // Initialize nodes and links arrays for this diagram
      this.nodes = [];
      this.links = [];

      // Calculate x and y coordinates for nodes in a sinusoidal pattern
      const numNodes = actionLogs.length;
      const amplitude = 200; // Adjust the amplitude of the sinusoidal curve
      const frequency = 0.1; // Adjust the frequency of the sinusoidal curve

      actionLogs.forEach((log, index) => {
        const x = index * 50; // Adjust the horizontal spacing between nodes
        const y = amplitude * Math.sin(frequency * index) + 200; // Calculate y coordinate using sinusoidal equation
        const newNode: NodeDatum = { id: `ActionLog_${log.id}`, label: `${log.action} - ${log.entityName}`, x, y };
        this.nodes.push(newNode);
        this.entityname = log.entityName;
        // Assuming you want to link actions based on their sequence
        if (index > 0) {
          const newLink = {
            source: `ActionLog_${actionLogs[index - 1].id}`,
            target: `ActionLog_${log.id}`
          };
          this.links.push(newLink);
        }
      });

      // Generate the diagram after updating nodes and links
      this.generateActionLogDiagram();
    });
  }


  generateActionLogDiagram() {
    const svgWidth = 1200;
    const svgHeight = 600;
    

    const svg = d3.select(this.actionLogDiagram.nativeElement).append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', 'translate(50, 50)'); // Adjust margins as needed

    // Define arrowhead marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 3) // Adjust the size of the arrowhead
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6) // Adjust the size of the arrowhead
      .attr('markerHeight', 6) // Adjust the size of the arrowhead
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999');

    // Create a tree layout
    const treeLayout = d3.tree<NodeDatum>().size([svgWidth - 100, svgHeight - 100]).separation((a, b) => {
      return a.parent === b.parent ? 20 : 20; // Adjust the separation based on your needs
    });

    // Assign coordinates to each node
    const rootNode: NodeDatum = {
      id: 'root', // You need to provide an id for the root node
      label: `ProjectOffer: ${this.entityname.toString()}`, // You need to provide a label for the root node
      children: this.nodes // Assign the nodes array as children of the root node
    };

    const root = d3.hierarchy<NodeDatum>(rootNode);
    treeLayout(root);

    // Define the symbol generator for Diamond
    const diamondSymbol = d3.symbol().type(d3.symbolCircle).size(900);

    // Draw nodes
    svg.selectAll('.node')
      .data(root.descendants())
      .enter().append('path')
      .attr('class', 'node')
      .attr('d', diamondSymbol) // Use the diamond symbol generator
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`) // Translate to node position
      .attr('fill', 'rgba(131, 164, 190, 0.42)')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);


    // Draw links
    const linkPaths = svg.selectAll('.link')
      .data(root.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d => {
        const sourceX = d.source.x ?? 0;
        const sourceY = d.source.y ?? 0;
        const targetX = d.target.x ?? 0;
        const targetY = d.target.y ?? 0;
        return `M${sourceX},${sourceY}L${targetX},${targetY}`;
      })
      .attr('fill', 'none')
      .attr('stroke', 'rgba(131, 164, 190, 0.42)')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)'); // Add arrowhead marker

    // Call the function to animate data flow
    this.animateDataFlow(linkPaths);
    // Add labels to nodes
    svg.selectAll('.label')
      .data(root.descendants())
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', (d: any) => d.x !== undefined ? d.x : 0) // Set default value for x if undefined
      .attr('y', (d: any) => d.y !== undefined ? d.y + 5 : 0) // Set default value for y if undefined
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Arial')
      .attr('font-size', 12)
      .text(d => d.data.label)
      .attr('fill', 'black')
      .each(function (d) {
        // Rotate labels for better readability
        if (d.y !== undefined && d.x !== undefined) {
          const bbox = this.getBBox();
          const width = bbox.width;
          const height = bbox.height;
          const x = d.x;
          const y = d.y + 5;

          d3.select(this)
            .attr('x', x)
            .attr('y', y)
            .attr('transform', `rotate(25, ${x}, ${y})`);
        }
      });


  }

  animateDataFlow(linkPaths: d3.Selection<SVGPathElement, d3.HierarchyLink<NodeDatum>, SVGGElement, unknown>) {
    linkPaths.each(function (d) {
      const link = d3.select(this);
      const totalLength = link.node()?.getTotalLength(); // Use optional chaining to avoid null error
      if (totalLength !== undefined) {
        link.attr('stroke-dasharray', `${totalLength} ${totalLength}`)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(2000) // Duration of animation in milliseconds
          .attr('stroke-dashoffset', 0); // Animate the dash offset to zero
      }
    });
  }

  navigateToNextSvg() {
    // Increment the currentSvgIndex
    this.currentSvgIndex = (this.currentSvgIndex + 1) % this.entityIds.length;
    // Clear previous diagram
    d3.select(this.actionLogDiagram.nativeElement).selectAll('*').remove();
    // Fetch data and generate the next diagram
    this.fetchDataAndGenerateDiagram(this.entityIds[this.currentSvgIndex].id);
  }

}
