import { UE } from '../entities/UE';
import type { IDAO } from './IDAO';

export class UeDAO implements IDAO<UE> {
  private static instance: UeDAO;
  private ues: UE[] = [];

  private constructor() {}

  static getInstance(): UeDAO {
    if (!UeDAO.instance) {
      UeDAO.instance = new UeDAO();
    }
    return UeDAO.instance;
  }

  async getAll(): Promise<UE[]> {
    return new Promise((resolve) => {
        resolve([...this.ues]);
    });
  }

  async get(id: number): Promise<UE> {
    return new Promise((resolve, reject) => {
      const ue = this.ues.find((u) => u.ID === id);
      if (ue) {
        resolve({ ...ue, Parcours: [...(ue.Parcours || [])] });
      } else {
        reject(new Error('UE non trouvée'));
      }
    });
  }

  async create(data: UE): Promise<UE> {
    return new Promise((resolve) => {
      const newId = this.ues.length > 0
        ? Math.max(...this.ues.map(u => u.ID || 0)) + 1
        : 1;

      const newUE = {
        ...data,
        ID: newId,
        Parcours: [...(data.Parcours || [])]
      };

      this.ues.push(newUE);
      resolve({ ...newUE, Parcours: [...(newUE.Parcours || [])] });
    });
  }

  async update(id: number, data: UE): Promise<UE> {
    return new Promise((resolve, reject) => {
      const index = this.ues.findIndex((u) => u.ID === id);
      if (index === -1) {
        reject(new Error('UE non trouvée'));
        return;
      }

      const updatedUE = {
        ...data,
        Parcours: [...(data.Parcours || [])]
      };
      this.ues[index] = updatedUE;
      resolve({ ...updatedUE, Parcours: [...(updatedUE.Parcours || [])] });
    });
  }

  async delete(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const index = this.ues.findIndex((u) => u.ID === id);
      if (index === -1) {
        reject(new Error('UE non trouvée'));
        return;
      }

      this.ues.splice(index, 1);
      resolve();
    });
  }

  async list(): Promise<UE[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.ues.map(ue => ({
          ...ue,
          Parcours: [...(ue.Parcours || [])]
        })));
      }, 300);
    });
  }

  async getByParcours(parcoursId: number): Promise<UE[]> {
    return new Promise((resolve) => {
      const filteredUEs = this.ues.filter((ue) =>
        ue.Parcours?.some((parcours) => parcours.ID === parcoursId)
      );
      resolve(filteredUEs.map(ue => ({
        ...ue,
        Parcours: [...(ue.Parcours || [])]
      })));
    });
  }
}