export function calcTotal(itemArray) {
    let total = 0
    itemArray.forEach(element => {
        if (element.select == true) {
            total = total + (Number(element.price) * Number(element.quanty))
        }        
    });    
    return total
}