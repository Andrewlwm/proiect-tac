import * as fs from 'fs'

class AFD {
  private alphabet: string[]
  private transitions: number[][]
  private accepting_states: number[]
  private transitions_without_final_state: number[][]
  private equivalent: number[]
  constructor() {}

  get is_minimized() {
    return this.equivalent.length
  }

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
    this.equivalent = []
    this.transitions_without_final_state = this.transitions.filter(
      (_, i) => i !== this.transitions.length - 1
    )
    this.transitions_without_final_state.forEach((e, index, array) => {
      const arrayWithoutE = array.filter(
        (_, i) => ![this.equivalent, index].includes(i)
      )
      let found
      for (const elem of arrayWithoutE) {
        if (arraysEqual(elem, e)) {
          this.equivalent.push(index)
          found = true
          continue
        }
      }
      if (found) return
    })
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

      if (this.is_minimized) {
        to = this.equivalent.includes(transition)
          ? this.equivalent[0]
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

function arraysEqual(a, b) {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
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
