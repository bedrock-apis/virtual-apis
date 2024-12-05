import * as ACORN from 'acorn'

export type MapToPrintableNode<T> = {
  [K in keyof T]: T[K] extends ACORN.Node
    ? Node<PrintableNode<T[K]>>
    : T[K] extends ACORN.Node[]
      ? Node<PrintableNode<T[K][number]>>[]
      : T[K]
}

export type PrintableNode<N extends ACORN.Node> = Omit<
  N,
  'loc' | 'start' | 'end' | 'range'
>

export abstract class Node<N extends { type: string }> {
  public readonly type: N['type']
  public constructor(type: N['type']) {
    this.type = type
  }
  public toCallExpression() {
    return new CallExpression(this)
  }
}

export class CallExpression
  extends Node<ACORN.CallExpression>
  implements PrintableNode<MapToPrintableNode<ACORN.CallExpression>>
{
  public constructor(
    public callee: Node<PrintableNode<ACORN.Expression | ACORN.Super>>,
  ) {
    super('CallExpression')
  }

  arguments: Node<PrintableNode<ACORN.Expression | ACORN.SpreadElement>>[] = []
  public optional: boolean = false
}
