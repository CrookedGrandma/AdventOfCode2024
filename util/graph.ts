export class Graph<T extends string | number> {
    nodes: Map<T, GNode<T>> = new Map<T, GNode<T>>();

    addNode(id: T) {
        if (this.nodes.has(id))
            return;
        const node = new GNode(id);
        this.nodes.set(id, node);
    }

    addEdge(from: T, to: T) {
        const f = this.nodes.get(from);
        if (!f)
            throw Error(`Could not find 'from' node ${from}`);
        const t = this.nodes.get(to);
        if (!t)
            throw Error(`Could not find 'to' node ${to}`);

        f.addChild(t);
        t.addParent(f);
    }

    removeEdge(from: T, to: T) {
        const f = this.nodes.get(from);
        if (!f)
            throw Error(`Could not find 'from' node ${from}`);
        const t = this.nodes.get(to);
        if (!t)
            throw Error(`Could not find 'to' node ${to}`);

        f.removeChild(t);
        t.removeParent(f);
    }
}

export class GNode<T extends string | number> {
    id: T;
    parents: GNode<T>[] = [];
    children: GNode<T>[] = [];

    constructor(id: T) {
        this.id = id;
    }

    hasChild(id: T): boolean {
        return this.children.some(c => c.id === id);
    }

    hasParent(id: T): boolean {
        return this.parents.some(c => c.id === id);
    }

    addChild(child: GNode<T>) {
        if (!this.hasChild(child.id))
            this.children.push(child);
    }

    addParent(parent: GNode<T>) {
        if (!this.hasParent(parent.id))
            this.parents.push(parent);
    }

    removeChild(child: GNode<T>) {
        if (this.hasChild(child.id))
            this.children.splice(this.children.indexOf(child), 1);
    }

    removeParent(parent: GNode<T>) {
        if (this.hasParent(parent.id))
            this.parents.splice(this.parents.indexOf(parent), 1);
    }
}
