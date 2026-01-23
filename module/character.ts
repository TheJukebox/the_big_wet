const { HTMLField, NumberField, SchemaField, StringField } = foundry.data.fields;
const { api, sheets } = foundry.applications;

const woundSeverity = [
    "Healthy",
    "Grazed",
    "Punctured",
    "Ripped",
    "Shattered",
    "Destroyed",
];

export class CharacterDataModel extends foundry.abstract.TypeDataModel {

    static defineSchema() {
        return {
            stats: new SchemaField({
                brain: new NumberField({ required: true, integer: true, initial: 0 }),
                lungs: new NumberField({ required: true, integer: true, initial: 0 }),
                nerves: new NumberField({ required: true, integer: true, initial: 0 }),
            }),
            wet: new NumberField({ required: true, integer: true, initial: 0 }),
            history: new StringField({ required: false, blank: true }),
            speciality: new StringField({ required: false, blank: true }),
            trinket: new StringField({ required: false, blank: true }),
            notes: new HTMLField({ required: false, blank: true }),
            wounds: new SchemaField({
                legs: new StringField({
                    required: false,
                    blank: true,
                    choices: woundSeverity,
                    initial: woundSeverity[0],
                }),
                lowerTorso: new StringField({
                    required: false,
                    blank: true,
                    choices: woundSeverity,
                    initial: woundSeverity[0],
                }),
                arms: new StringField({
                    required: false,
                    blank: true,
                    choices: woundSeverity,
                    initial: woundSeverity[0],
                }),
                upperTorso: new StringField({
                    required: false,
                    blank: true,
                    choices: woundSeverity,
                    initial: woundSeverity[0],
                }),
                head: new StringField({
                    required: false,
                    blank: true,
                    choices: woundSeverity,
                    initial: woundSeverity[0],
                }),
            }),
        };
    }
}

export class CharacterSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {
    constructor(options = {}) {
        super(options);
    }

    static DEFAULT_OPTIONS = {
        classes: ['thebigwet', 'character', 'actor'],
        position: {
            // actual sheet is like 105mm x 119mm
            width: 703,
            height: 814,
        },
        actions: {
            deleteItem: this._onDeleteItem,
            editItem: this._onEditItem,
            progressWound: this._progressWound,
            rollStat: this._rollStat,
        },
        form: {
            submitOnChange: true,
        },
        window: {
            title: "test",
        },
    };

    static PARTS = {
        form : { template: "systems/thebigwet/templates/character.hbs" }
    };

    async _prepareContext(options: any) {
        const context = await super._prepareContext(options);

        context.actor = this.actor;
        context.system = this.actor.system;

        return context;
    }

    _onRender(context: any, options: any) {
        super._onRender(context, options);
        return;
    }

    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        htmlElement.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        htmlElement.addEventListener("drop", async (e) => {
            e.preventDefault();
            const data = TextEditor.getDragEventData(e);
            if (!data || data.type !== "Item") return;           
            try {
                const item = await Item.implementation.fromDropData(data);
                console.debug("Dropped item: ", item);
                const itemData = item.toObject();
                await Item.create(itemData, { parent: this.actor });
                console.debug("Created item: ", itemData);
                console.log(this.actor.items);
            } catch (error) {
                console.error("we couldnt drop: ", error);
            }
        });
    }

    static async _onEditItem(event: Event, target: EventTarget) {
        event.preventDefault();
        event.stopPropagation();
        const itemId = target.closest("[data-item-id]")?.dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) {
            item.sheet.render(true);
        }
    }

    static async _onDeleteItem(event: Event, target: EventTarget) {
        const itemId = target.closest("[data-item-id]")?.dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) {
            await item.delete();
        };
    }

    static async _progressWound(event: Event, target: EventTarget) {
        event.preventDefault();
        event.stopPropagation();

        const woundArea = target.closest("[data-wound]")?.dataset.wound;
        console.debug("Clicked ", woundArea);
        const actorWoundLevel = this.actor.system.wounds[woundArea];
        const i = woundSeverity.indexOf(actorWoundLevel);
        switch (woundArea) {
            case "head":
                await this.actor.update({ "system.wounds.head": woundSeverity[i+1] ?? woundSeverity[0]});
                return;
            case "upperTorso":
                await this.actor.update({ "system.wounds.upperTorso": woundSeverity[i+1] ?? woundSeverity[0]});
                return;
            case "lowerTorso":
                await this.actor.update({ "system.wounds.lowerTorso": woundSeverity[i+1] ?? woundSeverity[0]});
                return;
            case "arms":
                await this.actor.update({ "system.wounds.arms": woundSeverity[i+1] ?? woundSeverity[0]});
                return;
            case "legs":
                await this.actor.update({ "system.wounds.legs": woundSeverity[i+1] ?? woundSeverity[0]});
                return;
        }
    }

    static async _rollStat(event: Event, target: EventTarget) {
        event.preventDefault();
        event.stopPropagation();

        const rollTarget: number = parseInt(target.closest("[data-value]")?.dataset.value);
        const wet: number = this.actor.system.wet;
        const rollType: string = target.closest("[data-roll-type]")?.dataset.rollType;

        let r: foundry.dice.Roll<any> = new Roll("1d100");
        await r.evaluate();
        console.log(r.total);
        const successful: boolean = r.total > wet && r.total < rollTarget;
        const rollHTML: string = `
            <div class="chat-roll-title">${rollType.toUpperCase()}</div>
            <div class="chat-roll-template">
                <div class="chat-roll-results">
                    <div class="chat-roll-box">${wet}</div>
                    <div class="chat-roll-symbol"><</div>
                    <div class="chat-roll-box" data-success="${successful}">${r.total}</div>
                    <div class="chat-roll-symbol"><</div>
                    <div class="chat-roll-box">${rollTarget}</div>
                </div>
            </div>
        `;

        ChatMessage.create({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker(this.actor),
            content: rollHTML,
            sound: "sounds/dice.wav",
        });
    }
}

