declare module '*.json' {
    const value: {
        Noms: string;
        Localisation: string;
        "Symptomes maladies": string;
        "Spécificités Diagnostic": string;
        "Traitement Prévention": string;
    }[];
    export default value;
} 