const { HTMLField, NumberField, SchemaField, StringField } = foundry.data.fields;
const { api, sheets } = foundry.applications;

export class CharacterDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const woundSeverity = {
            Grazed: "Grazed",
            Punctured: "Punctured",
            Ripped: "Ripped",
            Shattered: "Shattered",
            Destroyed: "Destroyed",
        };
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
                }),
                lowerTorso: new StringField({
                    required: false,
                    blank: true,
                    choices: woundSeverity,
                }),
                arms: new StringField({
                    required: false,
                    blank: true,
                    choices: woundSeverity,
                }),
                upperTorso: new StringField({
                    required: false,
                    blank: true,
                    choices: woundSeverity,
                }),
                head: new StringField({
                    required: false,
                    blank: true,
                    choices: woundSeverity,
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

    static async _onDeleteItem(event: Event, target: EventTarget) {
        const itemId = target.closest("[data-item-id]")?.dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) {
            await item.delete();
        };
    }
}

