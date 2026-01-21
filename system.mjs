import { CharacterDataModel } from "./module/character.js";

Hooks.once("init", () => {
    CONFIG.Actor.dataModels = {
        character: CharacterDataModel, 
    };
});
