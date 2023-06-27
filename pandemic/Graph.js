"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
const fs_1 = __importDefault(require("fs"));
class Graph {
    constructor() {
        this.adjacencyList = new Map();
    }
    static fromJSONFile(path) {
        const jsonData = fs_1.default.readFileSync(path, "utf-8");
        const data = JSON.parse(jsonData);
        const graph = new Graph();
        const { vertices, edges } = data;
        graph.addVertex(...vertices);
        for (const edge of edges) {
            graph.addEdge(edge.from, edge.to);
        }
        return graph;
    }
    addVertex(...args) {
        for (const vertex of args) {
            if (!this.adjacencyList.has(vertex)) {
                this.adjacencyList.set(vertex, []);
            }
        }
    }
    removeVertex(...args) {
        for (const vertex of args) {
            const neighbours = this.getNeighbours(vertex);
            for (const neighbour of neighbours) {
                const neighbourNeighbours = this.getNeighbours(neighbour);
                if (neighbourNeighbours) {
                    this.adjacencyList.set(neighbour, neighbourNeighbours.filter((v) => v !== vertex));
                }
            }
            this.adjacencyList.delete(vertex);
        }
    }
    addEdge(vertex1, vertex2) {
        if (this.adjacencyList.has(vertex1) && this.adjacencyList.has(vertex2)) {
            const neighbours1 = this.getNeighbours(vertex1);
            const neighbours2 = this.getNeighbours(vertex2);
            if (!neighbours1.includes(vertex2)) {
                neighbours1.push(vertex2);
            }
            if (!neighbours2.includes(vertex1)) {
                neighbours2.push(vertex1);
            }
        }
    }
    removeEdge(vertex1, vertex2) {
        const neighbours1 = this.getNeighbours(vertex1);
        const neighbours2 = this.getNeighbours(vertex2);
        if (neighbours1.length >= 1) {
            this.adjacencyList.set(vertex1, neighbours1.filter((v) => v !== vertex2));
        }
        if (neighbours2.length >= 1) {
            this.adjacencyList.set(vertex2, neighbours2.filter((v) => v !== vertex1));
        }
    }
    areNeighbours(vertex1, vertex2) {
        const neighbours = this.getNeighbours(vertex1);
        return neighbours !== undefined && neighbours.includes(vertex2);
    }
    getNeighbours(vertex) {
        return this.adjacencyList.get(vertex) || [];
    }
    get vertices() {
        return Array.from(this.adjacencyList.keys());
    }
    hasVertex(vertex) {
        return this.adjacencyList.has(vertex);
    }
    toString() {
        let result = "";
        for (const [vertex, neighbours] of this.adjacencyList.entries()) {
            result += `${vertex} ---> ${neighbours.join(", ")}\n`;
        }
        return result;
    }
    *[Symbol.iterator]() {
        for (const vertex of this.adjacencyList.keys()) {
            yield vertex;
        }
    }
}
exports.Graph = Graph;
