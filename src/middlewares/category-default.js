export const preventDefaultCategoriaDeletion = async function (next) {
    const categoria = await this.model.findOne(this.getFilter());
    if (categoria && categoria.isDefault) {
        throw new Error("No se puede eliminar la categoría por defecto.");
    }
    next();
};