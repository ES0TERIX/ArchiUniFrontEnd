import type { Parcours } from '../entities/Parcours';
import type { IDAO } from './IDAO';
import axios from 'axios';

export class ParcoursDAO implements IDAO<Parcours> {
  private static instance: ParcoursDAO;
  private parcours: Parcours[] = [
    { ID: 1, NomParcours: 'Master MIAGE', AnneeFormation: 2024 },
    { ID: 2, NomParcours: 'Master Info', AnneeFormation: 2024 },
    { ID: 3, NomParcours: 'Licence Info', AnneeFormation: 2023 }
  ];
  private nextId = 4;

  private constructor() {}

  public static getInstance(): ParcoursDAO {
    if (!ParcoursDAO.instance) {
      ParcoursDAO.instance = new ParcoursDAO();
    }
    return ParcoursDAO.instance;
  }

  public async create(data: Parcours): Promise<Parcours> {
    return new Promise((resolve) => {
      const newParcours = {
        ...data,
        ID: this.nextId++
      };
      this.parcours.push(newParcours);
      resolve(newParcours);
    });
  }

  public async get(id: number): Promise<Parcours> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const parcours = this.parcours.find(p => p.ID === id);
        if (parcours) {
          resolve(parcours);
        } else {
          reject(new Error('Parcours non trouvé'));
        }
      }, 300);
    });
  }

  public async update(id: number, data: Parcours): Promise<Parcours> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.parcours.findIndex(p => p.ID === id);
        if (index !== -1) {
          this.parcours[index] = { ...data, ID: id };
          resolve(this.parcours[index]);
        } else {
          reject(new Error('Parcours non trouvé'));
        }
      }, 300);
    });
  }

  public async delete(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.parcours.findIndex(p => p.ID === id);
        if (index !== -1) {
          this.parcours.splice(index, 1);
          resolve();
        } else {
          reject(new Error('Parcours non trouvé'));
        }
      }, 300);
    });
  }

  public async list(): Promise<Parcours[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.parcours]); // Retourne une copie du tableau
      }, 300);
    });
  }
}