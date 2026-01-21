import { CharacterDataModel } from "./module/character";

Hooks.once("init", () => {
    CONFIG.Actor.dataModels = {
        character: CharacterDataModel, 
    };
});
