import { ValidatorBuilder } from "../ValidatorBuilder";

export type ValidatorBuilders<TModel> = {
    [propertyName in keyof TModel]?: ValidatorBuilder<TModel, TModel[propertyName]>
};