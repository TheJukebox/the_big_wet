const { HTMLField, NumberField, SchemaField, StringField } = foundry.data.fields;

export class CharacterDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        let woundSeverity = [
            "Grazed",
            "Punctured",
            "Ripped",
            "Shattered",
            "Destroyed",
        ]
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
                    required: true,
                    blank: false,
                    choices: woundSeverity,
                }),
                lowerTorso: new StringField({
                    required: true,
                    blank: false,
                    choices: woundSeverity,
                }),
                arms: new StringField({
                    required: true,
                    blank: false,
                    choices: woundSeverity,
                }),
                upperTorso: new StringField({
                    required: true,
                    blank: false,
                    choices: woundSeverity,
                }),
                head: new StringField({
                    required: true,
                    blank: false,
                    choices: woundSeverity,
                }),
            }),
        }
    }
}
