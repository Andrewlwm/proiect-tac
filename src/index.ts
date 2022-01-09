import * as fs from 'fs'

class AFD {
  private alphabet: string[]
  private transitions: number[][]
  private accepting_states: number[]
  private equivalents: number[]
  constructor() {}

  init_for_ab(): void {
    // (a|b)*abb
    this.alphabet = ['a', 'b']
    this.transitions = [
      [1, 2],
      [1, 3],
      [1, 2],
      [1, 4],
      [1, 2],
    ]
    this.accepting_states = [4]
  }

  init_for_abc(): void {
    this.alphabet = ['a', 'b', 'c']
    // (a|b|c)*abbc
    this.transitions = [
      [1, 2, 3],
      [1, 4, 3],
      [1, 2, 3],
      [1, 2, 3],
      [1, 5, 3],
      [1, 2, 6],
      [1, 2, 3],
    ]
    this.accepting_states = [6]
  }

  minimize(): void {
    const final_state_indexes = new Set<number>()
    const non_final_state_indexes = new Set<number>()

    this.transitions.forEach((_, index) => {
      if (this.accepting_states.includes(index)) {
        final_state_indexes.add(index)
      } else if (!final_state_indexes.has(index))
        non_final_state_indexes.add(index)
    })

    let previousViableSet = non_final_state_indexes
    let newViableSet = new Set<number>()
    let firstRun = true
    do {
      if (!firstRun) previousViableSet = newViableSet
      newViableSet = Array.from(previousViableSet).reduce((acc, crt) => {
        let viable = true
        const next = acc.size ? Array.from(acc)[acc.size - 1] : crt + 1
        for (let i = 0; i < this.transitions[crt].length; i++) {
          if (this.transitions[crt][i] !== this.transitions[next][i])
            if (!previousViableSet.has(this.transitions[crt][i])) {
              viable = false
            }
        }
        if (viable) acc.add(crt)
        return acc
      }, new Set<number>())
      firstRun = false
    } while (previousViableSet.size !== newViableSet.size)

    this.equivalents = Array.from(newViableSet)
  }

  simulate(input: string): void {
    let charIndex
    let from = 0 // A, starea initiala
    let to
    const A = 'A'.charCodeAt(0)

    console.info(`Input: ${input}`)

    Array.from(input).forEach((char) => {
      charIndex = this.alphabet.indexOf(char)
      const transition = this.transitions[from][charIndex]

      if (this.equivalents.length) {
        to = this.equivalents.includes(transition)
          ? this.equivalents[0]
          : transition
      } else {
        to = transition
      }

      console.info(
        `${char} (${charIndex}) ${String.fromCharCode(
          A + from
        )} -> ${String.fromCharCode(A + to)}`
      )

      from = to
    })

    if (this.accepting_states.includes(from)) console.info('ACCEPTED\n')
    else console.warn('REJECTED\n')
  }
}

function handleFile(err: any, data: string): void {
  if (err) throw err

  const afd = new AFD()
  if (data.includes('c')) afd.init_for_abc()
  else afd.init_for_ab()

  afd.minimize()
  data.split('\n').forEach((e) => afd.simulate(e))
}

function run_simulations(type: 'ab' | 'abc'): void {
  fs.readFile(`src/${type}.txt`, 'utf8', handleFile)
}

run_simulations('ab')
// run_simulations('abc')
