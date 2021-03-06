import {calculate} from './parser.js';

const EPSILON = 0.00001;

class valder {
  constructor(val, der) {
    this.val = val;
    this.der = der;
    this.type = "valder";
  }

  double() {
    return [this.val, this.der];
  }
}

const sin = (x) => {
  if ((typeof x === "number") && !isNaN(x)) {
    return Math.sin(x);
  } else if (typeof x === "object") {
    return new valder(sin(x.val), x.der.map(temp=>mul(temp, cos(x.val))));
  }
}

const cos = (x) => {
  if ((typeof x === "number") && !isNaN(x)) {
    return Math.cos(x);
  } else if (typeof x === "object") {
    return new valder(cos(x.val), x.der.map(temp=>mul(neg(temp), sin(x.val))));
  }
}

const tan = (x) => { //need baseDiv
  if ((typeof x === "number") && !isNaN(x)) {
    return Math.tan(x);
  } else if (typeof x === "object") {
    return new valder(tan(x.val), x.der.map(temp=> div(temp, mul(cos(x.val), cos(x.val)))));
  }
}

const asin = (x) => {
  if ((typeof x === "number") && !isNaN(x)) {
    return Math.asin(x);
  } else if (typeof x === "object") {
    return new valder(asin(x.val), x.der.map(temp=> div(temp, sqrt(minus(1, mul(x.val, x.val))))));
  }
}

const acos = (x) => {
  if ((typeof x === "number") && !isNaN(x)) {
    return Math.acos(x);
  } else if (typeof x === "object") {
    return new valder(acos(x.val), x.der.map(temp=> div(neg(temp), sqrt(minus(1, mul(x.val, x.val))))));
  }
}

const atan = (x) => {
  if ((typeof x === "number") && !isNaN(x)) {
    return Math.atan(x);
  } else if (typeof x === "object") {
    return new valder(atan(x.val), x.der.map(temp => div(temp, plus(1, mul(x.val, x.val)))));
  }
}

const mul = (x0, x1) => {
  if ((typeof x0 === "number") && (typeof x1 === "number") && !isNaN(x0) && !isNaN(x1)) {
    return x0*x1
  } else if ((typeof x0 === "object") || (typeof x1 === "object")) {

    if ((typeof x0 === "number") && (typeof x1 !== "number")) {
      x0 = new valder(x0, x1.der.map(temp => 0));
    }

    if ((typeof x1 === "number") && (typeof x0 !== "number")) {
      x1 = new valder(x1, x0.der.map(temp => 0));
    }

    return new valder(mul(x0.val, x1.val), x1.der.map((temp,index) => plus(mul(temp,x0.val), mul(x1.val,x0.der[index]))));
  }
}

const div = (x0, x1) => {
  if ((typeof x0 === "number") && (typeof x1 === "number") && !isNaN(x0) && !isNaN(x1)) {
    return x0/x1
  } else if ((typeof x0 === "object") || (typeof x1 === "object")) {

    if ((typeof x0 === "number") && (typeof x1 !== "number")) {
      x0 = new valder(x0, x1.der.map(temp => 0));
    }

    if ((typeof x1 === "number") && (typeof x0 !== "number")) {
      x1 = new valder(x1, x0.der.map(temp => 0));
    }

    return new valder(div(x0.val,x1.val), x0.der.map((temp,index) => div(minus(mul(x1.val, temp), mul(x0.val, x1.der[index])), mul(x1.val, x1.val))))
  }
}

const neg = (x) => {
  if ((typeof x === "number") && !isNaN(x)) {
    return -x;
  } else if (typeof x === "object") {
    return new valder(neg(x.val), x.der.map(temp=>neg(temp)));
  }
}

const plus = (x0, x1) => {
  if ((typeof x0 === "number") && (typeof x1 === "number") && !isNaN(x0) && !isNaN(x1)) {
    return x0+x1
  } else if ((typeof x0 === "object") || (typeof x1 === "object")) {

    if ((typeof x0 === "number") && (typeof x1 !== "number")) {
      x0 = new valder(x0, x1.der.map(temp => 0));
    }

    if ((typeof x1 === "number") && (typeof x0 !== "number")) {
      x1 = new valder(x1, x0.der.map(temp => 0));
    }

    return new valder(plus(x0.val, x1.val), x0.der.map((temp, index) => plus(temp, x1.der[index])))
  }
}

const minus = (x0, x1) => {
  if ((typeof x0 === "number") && (typeof x1 === "number") && !isNaN(x0) && !isNaN(x1)) {
    return x0-x1;
  } else if ((typeof x0 === "object") || (typeof x1 === "object")) {
    if ((typeof x0 === "number") && (typeof x1 !== "number")) {
      x0 = new valder(x0, x1.der.map(temp => 0));
    }

    if ((typeof x1 === "number") && (typeof x0 !== "number")) {
      x1 = new valder(x1, x0.der.map(temp => 0));
    }

    return new valder(minus(x0.val, x1.val), x0.der.map((temp,index) => minus(temp, x1.der[index])));
  }
}

const exp = (x) => {
  if ((typeof x === "number") && !isNaN(x)) {
    return Math.exp(x);
  } else if (typeof x === "object") {
    return new valder(exp(x.val), x.der.map(temp => mul(temp, exp(x.val))))
  }
}

const sqrt = (x) => {
  if ((typeof x === "number") && !isNaN(x)) {
    return Math.sqrt(x);
  } else if (typeof x === "object") {
    return new valder(sqrt(x.val), x.der.map(temp => mul(temp, div(0.5, sqrt(x.val)))))
  }
}

const log = (x) => {
  if ((typeof x === "number") && !isNaN(x)) {
    return Math.log(x);
  } else if (typeof x === "object") {
    return new valder(log(x.val), x.der.map(temp => div(temp, x.val)))
  }
}

const power = (x0, x1) => {
  if ((typeof x0 === "number") && (typeof x1 === "number") && !isNaN(x0) && !isNaN(x1)) {
    return x0**x1
  } else if ((typeof x0 === "object") || (typeof x1 === "object")) {
    if ((typeof x0 === "number") && (typeof x1 !== "number")) {
      x0 = new valder(x0, x1.der.map(temp => 0));
    }

    if ((typeof x1 === "number") && (typeof x0 !== "number")) {
      x1 = new valder(x1, x0.der.map(temp => 0));
    }

    let ans;
    if (x1.val > 0) {
      ans = x0;
    } else if (x1.val < 0) {
      ans = div(1, x0);
    } else {
      return new valder(0, x0.der.map(temp => 0)); //ToDO: should this be a valder, der maybe wrong
    }

    for (let step = 1; step < Math.abs(x1.val); step++) {
      ans = mul(ans, x0);
    }

    return ans;
  }
}

//takes (equation, [var, var...]) where e.g. var = {'x':'3'}
const evaluate = (eq, variables) => { //remove test
  let valder_vars = {};
  let length = Object.keys(variables).length;

  Object.keys(variables).forEach((key, index) => {
    let partial_der = Array.apply(null, Array(length)).map(Number.prototype.valueOf,0);
    partial_der[index] = 1;
    let temp = new valder(variables[key], partial_der)
    valder_vars[key] = temp;
  })

  let ans = calculate(eq, valder_vars);

  return ans;
}

const backtrack = (r, ds, eq, stepSize, threshold, epsilon, variables) => {
  let beta = .5;
  let varsPrime = {};
  Object.keys(variables).forEach( (key,index) => {
    varsPrime[key] = variables[key] - ds.map(der => der*stepSize)[index];
  });
  let rPrime = evaluate(eq, varsPrime).val;
  if ((r - rPrime) >= (stepSize * threshold)) {
    return ([varsPrime, Math.abs(r-rPrime) < epsilon]);
  } else {
    return backtrack(r, ds, eq, stepSize * beta, threshold, epsilon, variables);
  }
}

const step = (eq, variables) => { //have to input cost function, takes one function
  let epsilon = EPSILON;
  let sol = evaluate(eq, variables).double();
  let r = sol[0];
  let ds = sol[1];
  let threshold = 0.5 * ds.map(der => der**2).reduce((acc, cur) => acc + cur);
  let next = backtrack(r, ds, eq, 1, threshold, epsilon, variables);
  let converged = next[1];

  if ( (r < epsilon) || ds.every(der => Math.abs(der) < epsilon) || converged) {
    return [variables, "done"];
  } else {
    return next;
  }
}

const minimize = (eq, variables) => { //single eq and variables
  let path = [];
  let current = step(eq, variables);
  path.push(current[0])

  let newVariables, converged;

  while (current[1] !== "done") {
    newVariables = current[0];
    path.push(newVariables);

    current = step(eq, newVariables);
  }

  // console.log("path", path.length);
  return path.pop();
}

const parseComb = eqs => {
  eqs = eqs.map(eq => `(${eq})*(${eq})`);
  return eqs.join("+");
}

const splitAt = (index, array) => {
  let front = array.slice(0,index);
  let back = array.slice(index);
  return [front, back];
}

const solveSystem = (eqns, vars) => {
  if (eqns.length < 1) {return ["empty", vars]} //TODO: what should element 0 be?
  let epsilon = EPSILON;
  let eq = parseComb(eqns);
  let varsPrime = minimize(eq, vars);
  let scores = eqns.map(eq => evaluate(eq, varsPrime).val**2);
  let satisfied = scores.map(score => score < Math.sqrt(epsilon));

  if (satisfied.every(constraint => constraint === true)) {
    return [satisfied, varsPrime]
  } else {
    let indices = [];
    satisfied.forEach((constraint, index) => {
      if (constraint === false) { indices.push(index)}
    })
    let [front, back] = splitAt(indices[0], eqns);
    let newEqs = front.concat(back.slice(1));

    let [satisfiedPrime, out] = solveSystem(newEqs, varsPrime);

    let [a, b] = splitAt(indices[0], satisfiedPrime);

    return [a.concat([false]).concat(b), out];
  }
}

const test = () => {

  let x = new valder(2, [1,0]);
  let y = new valder(3, [0,1]);

  let eq = mul(plus(x,5),plus(x,y));

  let eq2 = evaluate("(x+5)*(x+y)", {x:2, y:3})

  let z = new valder(new valder(new valder(3, [1]), [1]), [1])
  let eq3 = mul(z, sin(mul(z, z)));
  //eq3.der[0].der[0].der[0] === 495.92803531774314

  minimize("((2*x+3*y)*(x-y)-2)**2 + (3*x+y-5)**2",{x:2,y:0})

  // console.log(eq);

}

export {valder, sin, cos, tan, asin, acos,
        atan, mul, div, neg, plus, minus,
        exp, sqrt, power, log, evaluate,
        step, minimize, solveSystem,
        test}
