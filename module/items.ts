const { HTMLField, NumberField, SchemaField, StringField } = foundry.data.fields;
const { api, sheets } = foundry.applications;

export class SupplyDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            slots: new NumberField({ required: true, integer: false, initial: 0 }),
            bullets: new NumberField({ required: true, integer: true, initial: 0 }),
            proof: new NumberField({ required: true, integer: true, initial: 0 }),
            description: new StringField({ required: false, blank: true }),
        };
    }
}

export class SupplySheet extends api.HandlebarsApplicationMixin(sheets.ItemSheetV2) {
    constructor(options = {}) {
        super(options);
    }

    static DEFAULT_OPTIONS = {
        classes: ['thebigwet', 'item', 'supply'],
        position: {
            // actual sheet is like 105mm x 119mm
            width: 814,
            height: 665,
        },
        actions: {
            editImage: SupplySheet._onEditImage,
        },
        form: {
            submitOnChange: true,
        },
    };

    static PARTS = {
        form : { template: "systems/thebigwet/templates/supply.hbs" }
    };

    async _prepareContext(options: any) {
        const context = await super._prepareContext(options);

        context.item = this.item;
        context.system = this.item.system;

        return context;
    }

    static async _onEditImage(event: Event, target: EventTarget) {
        new FilePicker({
            type: "image",
            current: this.document.img,
            callback: async (path) => {
                await this.document.update({ img: path });
            }
        }).render(true);
    }

    _onRender(context: any, options: any) {
        super._onRender(context, options);
        return;
    }
}
