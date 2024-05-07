import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Event } from "../Models/Event";

// Importez les types manquants de d3
import { ScaleBand, ScaleLinear, Axis, Selection, BaseType } from 'd3';

@Component({
  selector: 'app-feedback-stats-chart-d3',
  templateUrl: './feedback-stats-chart-d3.component.html',
  styleUrls: ['./feedback-stats-chart-d3.component.css']
})
export class FeedbackStatsChartD3Component implements OnInit {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
  @Input() events: Event[] = []; // Les données des événements avec leurs évaluations

  constructor() { }

  ngOnInit(): void {
    this.calculateAverageRatings();
    this.createChart();
  }

  calculateAverageRatings(): void {
    this.events.forEach(event => {
      const ratings = event.feedbacks.map(feedback => feedback.note);
      const sum = ratings.reduce((total, rating) => total + rating, 0);
      event.averageRating = ratings.length > 0 ? sum / ratings.length : 0;
    });
  }

  createChart(): void {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', 400)
      .attr('height', 200)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x: ScaleBand<string> = d3.scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(this.events.map(event => event.event_name));

    const y: ScaleLinear<number, number> = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(this.events, event => event.averageRating || 0)!]);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svg.append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(y));

    svg.selectAll('.bar')
      .data(this.events)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (event: Event) => x(event.event_name)! ) // Supprimez la condition || 0
      .attr('width', x.bandwidth())
      .attr('y', (event: Event) => y(event.averageRating!) ) // Supprimez la condition || 0
      .attr('height', (event: Event) => height - y(event.averageRating!) ); // Supprimez la condition || 0
  }
}
