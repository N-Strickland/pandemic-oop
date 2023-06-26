"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardStack = void 0;
const fs_1 = __importDefault(require("fs"));
const Stack_1 = require("./Stack");
class CardStack {
    constructor(stack) {
        if (stack === undefined) {
            this.stack = new Stack_1.Stack();
            return;
        }
        this.stack = stack;
    }
    static buildFromFile(path) {
        const cardStack = new CardStack();
        const jsonData = fs_1.default.readFileSync(path, "utf-8");
        const data = JSON.parse(jsonData);
        cardStack.stack.push(...data);
        return cardStack;
    }
    static buildEmptyStack() {
        return new CardStack();
    }
    static buildFromExistingStack(stack) {
        return new CardStack(stack);
    }
    static merge(cardStacks) {
        const stacks = cardStacks.map((cardStack) => cardStack.stack);
        const mergedStack = Stack_1.Stack.mergeStacks(stacks);
        return CardStack.buildFromExistingStack(mergedStack);
    }
    shuffle() {
        this.stack.shuffle();
    }
    take(n = 1) {
        if (n < 0) {
            return [];
        }
        const cards = [];
        for (let i = 0; i < n; i++) {
            const card = this.stack.pop();
            if (card === undefined) {
                return cards;
            }
            cards.push(card);
        }
        return cards;
    }
    put(card) {
        this.stack.push(card);
    }
    split(n) {
        return Stack_1.Stack.splitStacks(this.stack, n).map((stack) => CardStack.buildFromExistingStack(stack));
    }
    *[Symbol.iterator]() {
        for (const card of this.stack) {
            yield card;
        }
    }
}
exports.CardStack = CardStack;
