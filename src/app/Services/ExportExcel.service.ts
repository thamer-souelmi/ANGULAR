import { Injectable } from '@angular/core';
import { Workbook, Worksheet } from 'exceljs';
import * as FileSaver from 'file-saver';
import { Activity } from 'src/app/Models/Activity';
import { FillPattern } from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor() { }

  private formatDate(date: Date): string {
    // Format date as per your requirements
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  public exportToExcel(activities: Activity[], excelFileName: string): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Activities');

    // Define headers and set columns with widths and styles
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Activity Name', key: 'name', width: 25 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Start Time', key: 'startTime', width: 25 },
      { header: 'End Time', key: 'endTime', width: 25 },
      { header: 'Related Event', key: 'relatedEvent', width: 30 }
    ];

    // Apply styles to header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E78' }, // dark blue
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }, // white
        size: 12,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      };
    });

    // Add and style data rows
    activities.forEach((activity, index) => {
      const row = worksheet.addRow({
        id: activity.activity_id,
        name: activity.activity_name,
        description: activity.description,
        startTime: this.formatDate(activity.startTime),
        endTime: this.formatDate(activity.finishTime),
        relatedEvent: activity.event?.event_name || 'No related event'
      });

      // Apply alternating row color
      const fill: FillPattern = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: index % 2 === 0 ? 'FFFFFFFF' : 'FFF2F2F2' }, // alternating white and light gray
      };


      row.eachCell((cell) => {
        cell.fill = fill;
        cell.font = {
          color: { argb: 'FF000000' }, // black
          size: 11,
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'left',
          wrapText: true,
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD4D4D4' } },
          left: { style: 'thin', color: { argb: 'FFD4D4D4' } },
          bottom: { style: 'thin', color: { argb: 'FFD4D4D4' } },
          right: { style: 'thin', color: { argb: 'FFD4D4D4' } },
        };
      });
    });

    // Generate and save the Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, `${excelFileName}.xlsx`);
    });
  }
}
