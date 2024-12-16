export class Grid<T> {
    private readonly rows: T[][];
    private readonly columns: T[][];

    constructor(rows: T[][]) {
        this.rows = rows;
        this.columns = rows[0].map((_, iCol) => rows.map(row => row[iCol]));
    }

    getRow(i: number) {
        return this.rows[i];
    }

    getCol(i: number) {
        return this.columns[i];
    }

    getItems() {
        return this.rows.flat();
    }

    getItem(iCol: number, iRow: number) {
        return this.rows[iRow]?.[iCol];
    }

    setItem(iCol: number, iRow: number, value: T) {
        this.rows[iRow][iCol] = value;
        this.columns[iCol][iRow] = value;
    }

    get rowCount() {
        return this.rows.length;
    }

    get colCount() {
        return this.columns.length;
    }

    get itemCount() {
        return this.colCount * this.rowCount;
    }

    contains(x: number, y: number): boolean {
        return x >= 0 && x < this.colCount
            && y >= 0 && y < this.rowCount;
    }

    printGrid(mapping?: (item: T) => string) {
        const useMapping = !!mapping;
        for (let y = 0; y < this.rowCount; y++) {
            console.log(this.getRow(y).map(i => useMapping ? mapping(i) : i).join(""));
        }
    }
}
