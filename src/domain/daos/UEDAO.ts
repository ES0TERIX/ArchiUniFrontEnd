import { UE } from '../entities/UE';
import type { IDAO } from './IDAO';

export class UeDAO implements IDAO<UE> {
  // pas encore d'api pour les UEs
  private static instance : UeDAO;

  private ues : UE[] = [];

  private constructor() {}

  static getInstance() : UeDAO {
    if (!UeDAO.instance) {
      UeDAO.instance = new UeDAO();
    }
    return UeDAO.instance;
  }

  async getAll(): Promise<UE[]> {
    return this.ues;
  }

  async get(id: number): Promise<UE> {
    return this.ues.find((ues) => ues.ID === id) as UE;
  }

  async create(data: UE): Promise<UE> {
    // const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ue`, data.toJSON());
    data.ID = this.ues.length > 0 ? (this.ues[this.ues.length - 1]?.ID ?? 0) + 1 : 1;
    return data;
  }

  async update(id: number, data: UE): Promise<UE> {
    const index = this.ues.findIndex((ues) => ues.ID === id);
    if (index === -1) {
      throw new Error('UE non trouvé');
    }
    return this.ues[index];
  }

  async delete(id: number): Promise<void> {
    // const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/ue/${id}`);
    this.ues = this.ues.filter((ues) => ues.ID !== id);
  }

  async list(): Promise<UE[]> {
    return this.ues;
  }

  async getByParcours(parcoursId: number): Promise<UE[]> {
    return this.ues.filter((ue) => ue.Parcours?.find((parcours) => parcours.ID === parcoursId));
  }


}