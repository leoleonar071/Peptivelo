import raw from "../data/public-peptides.json";
import { peptideSchema } from "./peptide-schema";
// Generated public allowlist. Never import editorial records from client code.
export const publicPeptides = raw.map((record) => peptideSchema.parse(record));
