import type { PuzzleConfig } from '../types';

// toBase64() can't handle non-Latin1 chars (em dashes, emojis, etc.)
// Encode via UTF-8 first, then base64
const toBase64 = (str: string): string => btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));

export const puzzles: PuzzleConfig[] = [
  {
    id: 1,
    title: 'Stallen',
    subtitle: 'Hestekunnskaper',
    description: 'Hvor godt kjenner du egentlig hestene dine, Julie? Disse sp\u00F8rsm\u00E5lene er vanskeligere enn du tror.',
    type: 'horses_match',
    clue: toBase64('Byen er Oslo \u2014 eventyret ditt begynner i Norges hovedstad!'),
    icon: '\uD83D\uDC0E',
    theme: 'emerald',
  },
  {
    id: 2,
    title: 'Kampen Inni',
    subtitle: 'Husk m\u00F8nsteret',
    description: 'Du sa alltid at du kunne beseire enhver demon, Julie. Bevis det \u2014 memoriser m\u00F8nsteret og sl\u00E5 tilbake.',
    type: 'kpop_sequence',
    clue: toBase64('Se etter Dronningens... (Dronningens p\u00E5 norsk)'),
    icon: '\uD83D\uDDE1\uFE0F',
    theme: 'purple',
  },
  {
    id: 3,
    title: 'Rampelyset',
    subtitle: 'Ordmysterium',
    description: 'Disse ordene er helt i surr, akkurat som tankene mine n\u00E5r jeg ser deg. Finn dem, Julie.',
    type: 'katseye_scramble',
    clue: toBase64('...gate (som betyr \u00ABstreet\u00BB p\u00E5 norsk)'),
    icon: '\uD83D\uDC31',
    theme: 'pink',
  },
  {
    id: 4,
    title: 'Selskapspapirene',
    subtitle: 'Knekkekoden',
    description: 'En hemmelig beskjed er blitt fanget opp, og bare du kan dekode den. Hele selskapet f\u00F8lger med, Julie.',
    type: 'bridgerton_cipher',
    clue: toBase64('Adressenummeret er 25'),
    icon: '\uD83D\uDCDC',
    theme: 'amber',
  },
  {
    id: 5,
    title: 'Direktivet',
    subtitle: 'Sorterings\u00F8velse',
    description: 'Alt har sin plass, Julie \u2014 akkurat som du har din i mitt hjerte. Sorter disse skattene der de h\u00F8rer hjemme.',
    type: 'walle_sort',
    clue: toBase64('Noe deilig venter p\u00E5 deg der...'),
    icon: '\uD83E\uDD16',
    theme: 'yellow',
  },
  {
    id: 6,
    title: 'Den Kvelden i Hamburg',
    subtitle: 'Husker du?',
    description: 'Husker du lysene, folkemengden, musikken? La oss se hvor mye du husker fra kvelden v\u00E5r, Julie.',
    type: 'greenday_trivia',
    clue: toBase64('Ankomst kl. 18:00 den 14. februar'),
    icon: '\uD83C\uDFB8',
    theme: 'green',
  },
  {
    id: 7,
    title: 'Bortkommet i Byen',
    subtitle: 'Finn veien',
    description: 'Ett siste eventyr, Julie. Finn veien gjennom de svingete gatene \u2014 noe spesielt venter p\u00E5 slutten.',
    type: 'london_maze',
    clue: toBase64('Den fulle adressen: Dronningens gate 25, Oslo. Vi sees p\u00E5 valentinsdagen, Julie! \uD83D\uDC95'),
    icon: '\uD83C\uDDEC\uD83C\uDDE7',
    theme: 'blue',
  },
];
