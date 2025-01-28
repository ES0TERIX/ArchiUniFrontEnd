import { Etudiant } from '../entities/Etudiant';
import type { IDAO } from './IDAO';
export class EtudiantDAO implements IDAO<Etudiant> {
  // pas encore d'api pour les Etudiants
  private static instance : EtudiantDAO;
  private etudiants : Etudiant[] = [];
  private constructor() {}
  static getInstance() : EtudiantDAO {
    if (!EtudiantDAO.instance) {
      EtudiantDAO.instance = new EtudiantDAO();
    }
    return EtudiantDAO.instance;
  }
  async getAll(): Promise<Etudiant[]> {
    return this.etudiants;
  }
  async get(id: number): Promise<Etudiant> {
    return this.etudiants.find((etudiants) => etudiants.ID === id) as Etudiant;
  }
  async create(data: Etudiant): Promise<Etudiant> {
    // const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ue`, data.toJSON());
    data.ID = this.etudiants.length > 0 ? (this.etudiants[this.etudiants.length - 1]?.ID ?? 0) + 1 : 1;
    return data;
  }
  async update(id: number, data: Etudiant): Promise<Etudiant> {
    const index = this.etudiants.findIndex((etudiants) => etudiants.ID === id);
    if (index === -1) {
      throw new Error('Etudiant non trouvé');
    }
    return this.etudiants[index];
  }
  async delete(id: number): Promise<void> {
    // const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/ue/${id}`);
    this.etudiants = this.etudiants.filter((etudiants) => etudiants.ID !== id);
  }
  async list(): Promise<Etudiant[]> {
    return this.etudiants;
  }
}