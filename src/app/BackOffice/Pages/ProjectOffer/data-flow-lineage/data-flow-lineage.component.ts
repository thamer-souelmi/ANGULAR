import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { QuoteService } from "../../../../Services/quote.service";
import { ProjectOfferService } from "../../../../Services/project-offer.service";
import { Quote } from "../../../../Models/quote";
import { ProjectOffer } from "../../../../Models/project-offer";
import { Observable, forkJoin, switchMap } from 'rxjs';
import { symbol } from 'd3-shape'; // Adjust the path accordingly
import { timeMinute } from 'd3-time';
import { Path } from 'd3-path';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActionLogService } from 'src/app/Services/action-log.service';
import { CustomSnackBarComponent } from '../custom-snack-bar/custom-snack-bar.component';


interface NodeDatum extends d3.SimulationNodeDatum {
  id: string;
  label: string; // Add label property to NodeDatum interface
  children?: NodeDatum[]; // Define children property

}

@Component({
  selector: 'app-data-flow-lineage',
  templateUrl: './data-flow-lineage.component.html',
  styleUrls: ['./data-flow-lineage.component.css']
})
export class DataFlowLineageComponent implements OnInit {
  @ViewChild('dataFlowDiagram', { static: true }) dataFlowDiagram!: ElementRef;
  private simulation: any;
  private nodes: NodeDatum[] = [];
  private links: any[] = [];
    //notification AFK

  inactiveEntityIds!: Observable<number[]>; // Observable to hold inactive entity IDs
  inactiveProjectOffers!: Observable<ProjectOffer[]>; // Observable to hold inactive project offers
  //notification AFK

  constructor(private actionLogService: ActionLogService,
    private quoteService: QuoteService, private projectOfferService: ProjectOfferService, private snackBar: MatSnackBar // Inject MatSnackBar
  ) { }

  ngOnInit() {
    this.fetchDataAndGenerateDiagram();
      //notification AFK

    this.fetchInactiveEntityIds(); // Fetch inactive entity IDs when component initializes
    this.inactiveProjectOffers.subscribe(offers => {
      if (offers && offers.length > 0) {
        offers.forEach((projectOffer, index) => {
          setTimeout(() => {
            this.showInactiveProjectOffer(projectOffer);
          }, index * 6000); // Show each offer with a 5-second delay
        });
      }
    });
      //notification AFK

  }
  //notification AFK

  fetchInactiveEntityIds(): void {
    this.inactiveEntityIds = this.actionLogService.getInactiveEntityIds();
    this.inactiveProjectOffers = this.inactiveEntityIds.pipe(
      switchMap((ids: number[]) => {
        return forkJoin<ProjectOffer[]>(
          ids.map((id: number) => this.projectOfferService.getProjectOfferById(id))
        );
      })
    );
  }
  // showInactiveProjectOffer(projectOffer: ProjectOffer): void {
  //   const config = new MatSnackBarConfig();
  //   config.horizontalPosition = 'end'; // Align snack bar to the right
  //   config.verticalPosition = 'top'; // Align snack bar to the top
  //   const snackBarRef = this.snackBar.open(`Project Title: ${projectOffer.projectTitle}`, 'Dismiss', {
  //     duration: 5000, // Display the notification for 5 seconds
  //     data: { icon: 'notifications', title: projectOffer.projectTitle, message: projectOffer.description },
  //     ...config // Merge custom configuration with default configuration
  //   });

  //   // Handle click on the snack bar to view content
  //   snackBarRef.onAction().subscribe(() => {
  //     // Implement the action when the user clicks on the snack bar
  //     console.log('SnackBar clicked');
  //   });
  // }


  //notif using component customsnackbar : 
  showInactiveProjectOffer(projectOffer: ProjectOffer): void {
    const config = new MatSnackBarConfig();
    config.horizontalPosition = 'end'; // Align snack bar to the right
    config.verticalPosition = 'top'; // Align snack bar to the top
    const message = `⌛ Project Title: ${projectOffer.projectTitle}\n${projectOffer.description}`; // Include clock icon in message
    const snackBarRef = this.snackBar.open(message, 'Dismiss', {
      duration: 5000, // Display the notification for 5 seconds
      ...config // Merge custom configuration with default configuration
    });

    // Handle click on the snack bar to view content
    snackBarRef.onAction().subscribe(() => {
      // Implement the action when the user clicks on the snack bar
      console.log('SnackBar clicked');
    });
  }
  //notif useing component : 

  //notification AFK
  fetchDataAndGenerateDiagram() {
    // Fetch quotes and project offers simultaneously
    forkJoin([
      this.quoteService.getQuotesNotNull(),
      this.projectOfferService.getProjectOffers()
    ]).subscribe(([quotes, projectOffers]: [Quote[], ProjectOffer[]]) => {
      // Process fetched project offers to create nodes
      projectOffers.forEach(projectOffer => {
        // Create a root node for each project offer
        const rootNode: NodeDatum = { id: `ProjectOffer_${projectOffer.offerId}`, label: `${projectOffer.projectTitle} - Description: ${projectOffer.status}` };
        this.nodes.push(rootNode);

        // Find quotes related to this project offer
        const relatedQuotes = quotes.filter(quote => quote.projectOfferId === projectOffer.offerId);

        // Create child nodes for each related quote
        relatedQuotes.forEach(quote => {
          const childNode: NodeDatum = { id: `Quote_${quote.quote_id}`, label: `Quote_${quote.description}` };
          rootNode.children = rootNode.children || [];
          rootNode.children.push(childNode);

          // Create a link between the project offer and its quote
          const newLink = {
            source: rootNode.id,
            target: childNode.id
          };
          this.links.push(newLink);
        });
      });

      // Generate the diagram after updating nodes and links
      this.generateDataFlowDiagram();
    });
  }


  generateDataFlowDiagram() {
    const svgWidth = 1100;
    const svgHeight = 600;

    const svg = d3.select(this.dataFlowDiagram.nativeElement).append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', 'translate(50, 50)'); // Adjust margins as needed

    // Define arrowhead marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 8) // Adjust the size of the arrowhead
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
      label: 'Project Offers', // You need to provide a label for the root node
      children: this.nodes // Assign the nodes array as children of the root node
    };

    const root = d3.hierarchy<NodeDatum>(rootNode);
    treeLayout(root);

    console.log('Root:', root);


    // Define the symbol generator for Wye
    const wyeSymbol = d3.symbol().type(d3.symbolDiamond).size(500);

    // Draw nodes
    svg.selectAll('.node')
      .data(root.descendants())
      .enter().append('path')
      .attr('class', 'node')
      .attr('d', wyeSymbol.size(800)) // Adjust the size of the Wye symbol
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`) // Translate to node position
      .attr('fill', 'rgba(131, 164, 190, 0.42)')
      .attr('stroke', '#fff')
      .attr('stroke-width', 4);

    // Add labels to nodes
   


    const linkPaths = svg.selectAll('.link')
      .data(root.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d => {
        return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`; // Draw a line from source to target
      })
      .attr('fill', 'none')
      .attr('stroke', 'rgba(131, 164, 190, 0.42)')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)'); // Add arrowhead marker


    // Call the function to animate data flow
    this.animateDataFlow(linkPaths);

    svg.selectAll('.label')
    .data(root.descendants())
    .enter().append('text')
    .attr('class', 'label')
    .attr('x', (d: any) => d.x !== undefined ? d.x : 0) // Set default value for x if undefined
    .attr('y', (d: any) => d.y !== undefined ? d.y + 5 : 0) // Set default value for y if undefined
    .attr('text-anchor', 'middle')
    .attr('font-family', 'Arial')
    .attr('font-size', 14)
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
          .attr('transform', `rotate(10, ${x}, ${y})`);
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



  private dragstarted(event: any, d: any) {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged(event: any, d: any) {
    d.fx = event.x;
    d.fy = event.y;
  }

  private dragended(event: any, d: any) {
    if (!event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}
