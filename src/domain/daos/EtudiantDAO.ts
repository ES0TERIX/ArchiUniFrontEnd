import { Etudiant } from '../entities/Etudiant';
import type { IDAO } from './IDAO';

export class EtudiantDAO implements IDAO<Etudiant> {
  private static instance: EtudiantDAO;
  private etudiants: Etudiant[] = [];

  private constructor() {}

  static getInstance(): EtudiantDAO {
    if (!EtudiantDAO.instance) {
      EtudiantDAO.instance = new EtudiantDAO();
    }
    return EtudiantDAO.instance;
  }

  async getAll(): Promise<Etudiant[]> {
    return new Promise((resolve) => {
        resolve([...this.etudiants]);
    });
  }

  async get(id: number): Promise<Etudiant> {
    return new Promise((resolve, reject) => {
      const etudiant = this.etudiants.find((e) => e.ID === id);
      if (etudiant) {
        resolve({ ...etudiant });
      } else {
        reject(new Error('Etudiant non trouvé'));
      }
    });
  }

  async create(data: Etudiant): Promise<Etudiant> {
    return new Promise((resolve) => {
      const newId = this.etudiants.length > 0
        ? Math.max(...this.etudiants.map(e => e.ID || 0)) + 1
        : 1;

      const newEtudiant = {
        ...data,
        ID: newId
      };

      this.etudiants.push(newEtudiant);
      resolve({ ...newEtudiant });
    });
  }

  async update(id: number, data: Etudiant): Promise<Etudiant> {
    return new Promise((resolve, reject) => {
      const index = this.etudiants.findIndex((e) => e.ID === id);
      if (index === -1) {
        reject(new Error('Etudiant non trouvé'));
        return;
      }

      this.etudiants[index] = { ...data };
      resolve({ ...this.etudiants[index] });
    });
  }

  async delete(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const index = this.etudiants.findIndex((e) => e.ID === id);
      if (index === -1) {
        reject(new Error('Etudiant non trouvé'));
        return;
      }

      this.etudiants.splice(index, 1);
      resolve();
    });
  }

  async list(): Promise<Etudiant[]> {
    return new Promise((resolve) => {
        resolve([...this.etudiants]);
    });
  }
}