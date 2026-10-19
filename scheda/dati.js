// SCHEDE APPARTAMENTO (Michele 19/10): dati presi SOLO dalle schede PDF (~/Progetti/SACROFANO/Appartamento_nr. N.pdf).
// Per ora solo il 4, da approvare; gli altri arrivano dopo, uguali. I titoli dei gruppi ("La casa", "Impianti", "Vendita") sono solo
// per ordinare la pagina: le voci e i valori sono quelli della scheda, nessuno inventato.
window.SCHEDE={
 4:{
  indirizzo:'Via Monterosso 17, Sacrofano (RM)',
  tipologia:'Appartamento con giardino',
  dove:'Piano terra',
  fonte:'SUL = superficie utile lorda.',
  prezzo:135000,
  reddito:true, // "Stato: Locato con rendita 5%" -> IMMOBILE A REDDITO, come il LED giallo nel rendering
  rendita:'Locato con rendita 5%',
  numeri:[[69,'m²','SUL interna'],[32,'m²','Giardino'],[12,'m²','Patio']],
  essenziali:[['locali','Locali','2'],['camere','Camere da letto','1'],['bagni','Bagni','1'],['piano','Piano','Terra']],
  gruppi:[
   ['La casa',[['cottura','Cucina','Angolo cottura'],['arredato','Arredato','Sì'],['giardino','Giardino','32 m² + 12 m² patio'],['posto','Posto auto','1']]],
   ['Impianti',[['riscaldamento','Riscaldamento','Autonomo'],['clima','Climatizzazione','Daikin caldo/freddo']]],
   ['Vendita',[['contratto','Contratto','Vendita'],['stato','Stato','Locato con rendita 5%'],['superficie','SUL interna','69 m²']]]
  ],
  altre:[['panorama','Esposizione esterna e panoramica'],['infissi','Infissi esterni in doppio PVC Schulz'],['porta','Porta blindata'],['video','Impianto condominiale di videosorveglianza']],
  piantine:[['','scheda/piantine/appartamento-4.jpg','scheda/piantine/appartamento-4-dettaglio.jpg']], // [nome livello, piantina, versione ravvicinata per lo zoom]
  posizione:'scheda/piantine/posizione-4.jpg', // la piantina del complesso con il 4 evidenziato, ritagliata dalla scheda PDF
  video:[['ingresso','Ingresso'],['fronte','Fronte'],['giardino','Giardino']] // il retro del 4 nel modello non si vede (da sul passaggio coperto): niente Retro
 }
};
