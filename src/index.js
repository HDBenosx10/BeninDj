const valuesKeeped = []


const sequence = {
    _id:1,
    get id() {return this._id++}
}

const addItem = (event,value,recivedClass) => {
    const input = document.getElementById('addValue')
    const valueToAdd = value || input.value
    input.value = ""
    let valueClass = ''
    recivedClass ?
    valueClass = `${recivedClass}`: 
    valueClass ="todo"
    
    const newTask = document.createElement('div')
    const deletButton = document.createElement('span')
    deletButton.innerHTML = '&#x2613';
    const taskName = document.createElement('p')
    newTask.appendChild(deletButton)
    
    newTask.classList.add(`task`)
    taskName.innerText = valueToAdd
    newTask.appendChild(taskName)
    
    newTask.draggable = true
    newTask.id = newTask.id || `draggable-item-${sequence.id}`
    newTask.ondragstart = e => e.dataTransfer.setData('item-id', e.target.id)
    
    document.querySelector(`#${valueClass}`).appendChild(newTask)
    
    valuesKeeped.push(
        {
            value : valueToAdd,
            class : valueClass,
            id : newTask.id
            
        }
        
        )
    localStorage.setItem(`savedTasks`,JSON.stringify(valuesKeeped))
    addDelButtons()
        
}

const deletItem = (event) => {
    const trigger = event.target
    const triggerParent = trigger.parentNode
    const triggerGranGranpa = triggerParent.parentNode.id
    document.querySelector(`#${triggerGranGranpa}`).removeChild(triggerParent)
    const storageTasks = localStorage.getItem('savedTasks')
    const storageObjects = JSON.parse(storageTasks)
    storageObjects.forEach(e => {
        if ( triggerParent.id === e.id ) {
            const index = storageObjects.indexOf(e)
            storageObjects.splice(index,1)
        }
    })
    localStorage.clear()
    localStorage.setItem('savedTasks',JSON.stringify(storageObjects))

}

const addDelButtons = () => {
    const delButtons = document.querySelectorAll('.task span')
    delButtons.forEach( e => {
        e.addEventListener("click",deletItem)
    })
}

document.getElementById('addValue').addEventListener('keyup',(event)=>{
    if(event.key === 'Enter'){
        document.querySelector('#add').click()
    }
})
document.querySelector('#add').addEventListener("click",addItem)

if(localStorage.getItem('savedTasks')) {
    const storageTasks = localStorage.getItem('savedTasks')
    const storageObjects = JSON.parse(storageTasks)
    
    storageObjects.forEach(e => {
        addItem('',e.value,e.class)
    })
    addDelButtons()
}


const dropzones = document.querySelectorAll('[can-drop]')

dropzones.forEach(dropzone => {
    dropzone.ondragover = e => e.preventDefault()
    dropzone.ondrop = function(e) {
        const id = e.dataTransfer.getData('item-id')
        const item = document.getElementById(id)
        dropzone.appendChild(item)
        const allItem = JSON.parse(localStorage.getItem('savedTasks'))
        allItem.forEach(e => {
            if(e.id === id) {
                e.class = dropzone.id
            }
        })
        localStorage.clear()
        localStorage.setItem('savedTasks',JSON.stringify(allItem))
    }
})