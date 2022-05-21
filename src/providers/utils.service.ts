export class UtilsService {
  static getColumnName(alias: string, column: string) {
    return column.indexOf('.') > 0 ? column : `${alias}.${column}`;
  }
}
