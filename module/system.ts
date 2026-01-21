import { CharacterDataModel, CharacterSheet } from "./character";

Hooks.once("init", () => {
    CONFIG.Actor.dataModels = {
        character: CharacterDataModel, 
    };
    
    Actors.unregisterSheet('core', ActorSheet)
    Actors.registerSheet('character', CharacterSheet, {
        makeDefault: true,
        label: 'THEBIGWET.SheetLabels.Actor',
    });

});
