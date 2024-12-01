declare type Output = string | number | (string | number)[];

declare interface Position {
    x: number;
    y: number;
}

declare interface AStarNode<T> {
    item: T;
    cameFrom?: AStarNode<T>;
    gScore: number;
    fScore: number;
}
