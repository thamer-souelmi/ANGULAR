import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Activity } from 'src/app/Models/Activity';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor() { }

  public exportToExcel(activities: Activity[], excelFileName: string): void {
    // Génération des données
    const data = activities.map(activity => ({
      'ID': activity.activity_id,
      'Nom': activity.activity_name,
      'Description': activity.description,
      'Heure de début': activity.startTime.toLocaleString(),
      'Heure de fin': activity.finishTime.toLocaleString(),
      'Événement': activity.event?.event_name || 'Aucun'
    }));

    // Création de la feuille
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Appliquer une largeur de colonne spécifique
    worksheet['!cols'] = [
      { wch: 10 },
      { wch: 20 },
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
    ];

    // Style de l'en-tête
    const range = XLSX.utils.decode_range(<string>worksheet['!ref']);
    for(let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1"; // Obtenir l'adresse de la cellule
      if(!worksheet[address]) continue; // Si la cellule n'existe pas, continuez
      worksheet[address].s = {
        fill: {
          fgColor: { rgb: "CCCCCC" }, // Gris clair
        },
        font: {
          name: 'Arial',
          sz: 14,
          bold: true,
          color: { rgb: "000000" }, // Noir
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
        border: {
          top: { style: "thin", color: { auto: 1} },
          right: { style: "thin", color: { auto: 1} },
          bottom: { style: "thin", color: { auto: 1} },
          left: { style: "thin", color: { auto: 1} }
        }
      };
    }

    // Création du classeur et ajout de la feuille
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Activités');

    // Télécharger le fichier
    XLSX.writeFile(workbook, `${excelFileName}.xlsx`);
  }
}
