export type Language = 'en' | 'fr' | 'es' | 'de';

const translations = {
  en: {
    header_subtitle: "Deduce the hidden order from the chaos.",
    button_how_to_play: "How to Play",
    button_reset: "Reset",
    help_modal_title: "How to Play",
    help_goal_title: "Goal:",
    help_goal_text: "Fill the entire grid with the correct numbers.",
    help_rows_title: "Rows:",
    help_rows_text: "Adjacent numbers in each row follow a consistent arithmetic rule.",
    help_cols_title: "Columns:",
    help_cols_text: "Adjacent numbers in each column also follow a consistent arithmetic rule.",
    help_controls_title: "Controls:",
    help_controls_text: "Click a cube ('?') to reveal a number. Click again to cycle through other possibilities.",
    help_clues_title: "Clues:",
    help_clues_text: "The cyan-colored squares are fixed clues. Use them to deduce adjacent numbers!",
    button_close: "Close",
    win_modal_title: "Congratulations!",
    win_modal_text: "You've restored the mathematical harmony.",
    button_play_again: "Play Again",
  },
  fr: {
    header_subtitle: "Déduisez l'ordre caché de la grille.",
    button_how_to_play: "Comment jouer",
    button_reset: "Réinitialiser",
    help_modal_title: "Comment Jouer",
    help_goal_title: "But du jeu :",
    help_goal_text: "Remplir toute la grille avec les bons numéros.",
    help_rows_title: "Lignes :",
    help_rows_text: "Les nombres adjacents dans chaque ligne suivent une règle arithmétique constante.",
    help_cols_title: "Colonnes :",
    help_cols_text: "Les nombres adjacents dans chaque colonne suivent également une règle arithmétique constante.",
    help_controls_title: "Contrôles :",
    help_controls_text: "Cliquez sur un cube ('?') pour révéler un numéro. Cliquez à nouveau pour faire défiler les autres possibilités.",
    help_clues_title: "Indices :",
    help_clues_text: "Les cases de couleur cyan sont des indices fixes. Utilisez-les pour déduire les numéros adjacents !",
    button_close: "Fermer",
    win_modal_title: "Félicitations !",
    win_modal_text: "Vous avez restauré l'harmonie mathématique.",
    button_play_again: "Rejouer",
  },
  es: {
    header_subtitle: "Deduce el orden oculto del caos.",
    button_how_to_play: "Cómo Jugar",
    button_reset: "Reiniciar",
    help_modal_title: "Cómo Jugar",
    help_goal_title: "Objetivo:",
    help_goal_text: "Llena toda la cuadrícula con los números correctos.",
    help_rows_title: "Filas:",
    help_rows_text: "Los números adyacentes en cada fila siguen una regla aritmética constante.",
    help_cols_title: "Columnas:",
    help_cols_text: "Los números adyacentes en cada columna también siguen una regla aritmética constante.",
    help_controls_title: "Controles:",
    help_controls_text: "Haz clic en un cubo ('?') para revelar un número. Haz clic de nuevo para recorrer otras posibilidades.",
    help_clues_title: "Pistas:",
    help_clues_text: "Los cuadrados de color cian son pistas fijas. ¡Úsalas para deducir los números adyacentes!",
    button_close: "Cerrar",
    win_modal_title: "¡Felicidades!",
    win_modal_text: "Has restaurado la armonía matemática.",
    button_play_again: "Jugar de Nuevo",
  },
  de: {
    header_subtitle: "Leite die verborgene Ordnung aus dem Chaos ab.",
    button_how_to_play: "Spielanleitung",
    button_reset: "Zurücksetzen",
    help_modal_title: "Spielanleitung",
    help_goal_title: "Ziel:",
    help_goal_text: "Fülle das gesamte Gitter mit den richtigen Zahlen.",
    help_rows_title: "Zeilen:",
    help_rows_text: "Benachbarte Zahlen in jeder Zeile folgen einer konsistenten arithmetischen Regel.",
    help_cols_title: "Spalten:",
    help_cols_text: "Benachbarte Zahlen in jeder Spalte folgen ebenfalls einer konsistenten arithmetischen Regel.",
    help_controls_title: "Steuerung:",
    help_controls_text: "Klicke auf einen Würfel ('?'), um eine Zahl aufzudecken. Klicke erneut, um durch andere Möglichkeiten zu blättern.",
    help_clues_title: "Hinweise:",
    help_clues_text: "Die zyanfarbenen Quadrate sind feste Hinweise. Nutze sie, um benachbarte Zahlen abzuleiten!",
    button_close: "Schließen",
    win_modal_title: "Herzlichen Glückwunsch!",
    win_modal_text: "Du hast die mathematische Harmonie wiederhergestellt.",
    button_play_again: "Erneut Spielen",
  }
};

export type TranslationKey = keyof typeof translations.en;

export const getTranslator = (lang: Language) => {
  return (key: TranslationKey): string => {
    const langTranslations = translations[lang] || translations['en'];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return langTranslations[key] || translations['en'][key];
  };
};

export const getBrowserLanguage = (): Language => {
    const lang = navigator.language.split(/[-_]/)[0];
    if (['en', 'fr', 'es', 'de'].includes(lang)) {
        return lang as Language;
    }
    return 'en';
};

export const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
];
