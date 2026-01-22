import { CharacterDataModel, CharacterSheet } from "./character";
import { SupplyDataModel, SupplySheet } from "./items";

Hooks.once("init", () => {
    CONFIG.Actor.dataModels = {
        character: CharacterDataModel, 
    };

    CONFIG.Item.dataModels = {
        supply: SupplyDataModel,  
    };
    
    Actors.unregisterSheet('core', ActorSheet)
    Actors.registerSheet('character', CharacterSheet, {
        makeDefault: true,
        label: 'THEBIGWET.SheetLabels.Actor',
    });

    Items.unregisterSheet('core', ItemSheet)
    Items.registerSheet('supply', SupplySheet, {
        makeDefault: true,
        label: 'THEBIGWET.SheetLabels.Item',
    });

});
