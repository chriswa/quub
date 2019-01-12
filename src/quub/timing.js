export let dt = 0
export let tt = 0

export function setDTAndIncrementTT(newDt) {
	dt = newDt
	tt += dt
}
