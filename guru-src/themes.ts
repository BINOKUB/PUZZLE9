export interface Theme {
  name: string;
  appBg: string;
  headerText: string;
  subtitleText: string;
  clueCube: string;
  interactiveCube: string;
  button: string;
  langButtonActive: string;
  langButtonInactive: string;
  modalBg: string;
  modalHeader: string;
  modalText: string;
  modalButton: string;
  themeSwatch: string;
}

export const themes: Record<string, Theme> = {
  guruBlue: {
    name: 'Guru Blue',
    appBg: 'bg-[#1e1b4b]',
    headerText: 'bg-gradient-to-r from-sky-400 to-cyan-300',
    subtitleText: 'text-slate-300',
    clueCube: 'bg-cyan-500 text-slate-900 font-black cursor-default shadow-inner shadow-cyan-900/50',
    interactiveCube: 'bg-indigo-900/50 text-indigo-200 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-indigo-800/80 hover:shadow-[0_0_15px_theme(colors.cyan.400)]',
    button: 'bg-white/10 backdrop-blur-sm border border-white/20 text-slate-300 hover:bg-white/20',
    langButtonActive: 'bg-cyan-500 text-slate-900',
    langButtonInactive: 'bg-transparent text-slate-300 hover:bg-white/10',
    modalBg: 'bg-indigo-900/80 backdrop-blur-lg border-sky-400/50',
    modalHeader: 'text-sky-400 drop-shadow-[0_0_8px_theme(colors.sky.500)]',
    modalText: 'text-slate-300',
    modalButton: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400',
    themeSwatch: 'bg-cyan-500',
  },
  crimsonForge: {
    name: 'Crimson Forge',
    appBg: 'bg-gray-900',
    headerText: 'bg-gradient-to-r from-amber-500 to-red-600',
    subtitleText: 'text-gray-400',
    clueCube: 'bg-red-600 text-white font-black cursor-default shadow-inner shadow-red-900/50',
    interactiveCube: 'bg-gray-800 text-red-300 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-gray-700 hover:shadow-[0_0_15px_theme(colors.red.500)]',
    button: 'bg-red-900/30 backdrop-blur-sm border border-red-500/30 text-red-300 hover:bg-red-900/40',
    langButtonActive: 'bg-red-600 text-white',
    langButtonInactive: 'bg-transparent text-red-300 hover:bg-white/10',
    modalBg: 'bg-gray-900/80 backdrop-blur-lg border-red-500/50',
    modalHeader: 'text-red-500 drop-shadow-[0_0_8px_theme(colors.red.600)]',
    modalText: 'text-gray-300',
    modalButton: 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500',
    themeSwatch: 'bg-red-600',
  },
  emeraldMatrix: {
    name: 'Emerald Matrix',
    appBg: 'bg-black',
    headerText: 'bg-gradient-to-r from-green-400 to-emerald-500',
    subtitleText: 'text-emerald-300',
    clueCube: 'bg-emerald-500 text-black font-black cursor-default shadow-inner shadow-emerald-900/50',
    interactiveCube: 'bg-emerald-900/50 text-emerald-200 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-emerald-800/80 hover:shadow-[0_0_15px_theme(colors.emerald.400)]',
    button: 'bg-green-900/40 backdrop-blur-sm border border-emerald-500/30 text-emerald-300 hover:bg-green-900/60',
    langButtonActive: 'bg-emerald-500 text-black',
    langButtonInactive: 'bg-transparent text-emerald-300 hover:bg-white/10',
    modalBg: 'bg-emerald-950/80 backdrop-blur-lg border-emerald-400/50',
    modalHeader: 'text-emerald-400 drop-shadow-[0_0_8px_theme(colors.emerald.500)]',
    modalText: 'text-emerald-200',
    modalButton: 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400',
    themeSwatch: 'bg-emerald-500',
  },
  royalAmethyst: {
    name: 'Royal Amethyst',
    appBg: 'bg-purple-950',
    headerText: 'bg-gradient-to-r from-fuchsia-500 to-amber-400',
    subtitleText: 'text-purple-300',
    clueCube: 'bg-amber-400 text-purple-900 font-black cursor-default shadow-inner shadow-amber-900/50',
    interactiveCube: 'bg-purple-900/60 text-amber-200 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-purple-800/80 hover:shadow-[0_0_15px_theme(colors.amber.300)]',
    button: 'bg-purple-800/30 backdrop-blur-sm border border-purple-400/30 text-amber-300 hover:bg-purple-800/50',
    langButtonActive: 'bg-amber-400 text-purple-900',
    langButtonInactive: 'bg-transparent text-amber-300 hover:bg-white/10',
    modalBg: 'bg-purple-950/80 backdrop-blur-lg border-fuchsia-500/50',
    modalHeader: 'text-fuchsia-400 drop-shadow-[0_0_8px_theme(colors.fuchsia.500)]',
    modalText: 'text-purple-200',
    modalButton: 'bg-gradient-to-r from-fuchsia-500 to-amber-500 hover:from-fuchsia-400 hover:to-amber-400',
    themeSwatch: 'bg-amber-400',
  },
};
