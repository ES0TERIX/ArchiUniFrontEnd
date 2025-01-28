import { Parcours } from './Parcours';

export interface IEtudiant {
  ID: number | null;
  NomEtudiant: string | null;
  NumeroEtudiant: string | null;
  Parcours: Parcours | null;

  toJSON(): Object;
}

export class Etudiant implements IEtudiant {
  constructor(
    public ID: number | null,
    public NomEtudiant: string | null,
    public NumeroEtudiant: string | null,
    public Parcours: Parcours | null
  ) {}

  toJSON(): Object {
    return {
      ID: this.ID,
      NomEtudiant: this.NomEtudiant,
      NumeroEtudiant: this.NumeroEtudiant,
      Parcours: this.Parcours?.ID
    };
  }
}