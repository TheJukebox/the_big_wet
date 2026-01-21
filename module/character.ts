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
            specialty: new StringField({ required: false, blank: true }),
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
            width: 603,
            height: 714,
        },
        actions: {
            viewDoc: this._viewDoc,
        },
        form: {
            submitOnChange: true,
        },
    };

    _onRender(context: any, options: any) {
        return;
    }

    _getEmbeddedDocument(target: EventTarget) {
        return;
    }

    static async _viewDoc(event: Event, target: EventTarget) {
        const doc = this._getEmbeddedDocument(target);
        doc.sheet.render(true);
    }

}
