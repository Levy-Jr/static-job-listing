const jobsContainer = document.querySelector('[data-card-container]')
const searchContainer = document.querySelector('[data-search-container]')
const searchFilters = document.querySelector('[data-search-content]')
const clear = document.querySelector('[data-clear]')

const getData = async () => {
  const response = await fetch('data.json')
  const data = await response.json()

  return data
}

/* creating cards */
/* item = data. In other words, item.featured = data.featured */
const makeCards = (item) => {
  return `
  ${featuredCard(item.featured)}
    <div class="job-list--header">

    <div class="logo">
      <img src=${item.logo} alt="company logo">
    </div>

    <div>
      <div class="flex">
        <p class="company | fw-bold">${item.company}</p>
        ${newFlags(item.new, item.featured)}
      </div>
      <p class="position | fw-bold">${item.position}</p>

      <ul role="list" class="list-informations | flex fw-bold">
        <li class="postedAt">${item.postedAt}</li>
        <li class="contract">${item.contract}</li>
        <li class="location">${item.location}</li>
      </ul>
    </div>

    </div>

    <ul class="filter-skills | flex" role="list">
      <!-- Role -->
      <li class="role"><button class="filter-button fw-bold filter">${item.role}</button></li>
      <!-- Level -->
      <li class="level"><button class="filter-button fw-bold filter">${item.level}</button></li>
      <!-- Languages -->
      ${createProgrammingLanguagesButton(item.languages)}
      ${toolsButton(item.tools)}
    </ul>
  </li> 
  `
}

/* adding the cards in html */
const addCards = () => {
  let cards = ""
  getData().then(json => {
    json.forEach(data => {
      cards += makeCards(data)
      jobsContainer.innerHTML = cards
    })
  })
}

addCards()

/* add featured card border. It returns the featured card border if is true */
const featuredCard = (featured) => {
  if(featured){
    return `<li class="job-list special">`
  }

  return `<li class="job-list">`
}

/* add the "new" flag and "featured" flag in the card */
/* If newFlag or featuredFlag is true, it is added on the card. Else, it's not added */
const newFlags = (newFlag, featuredFlag) => {
  let flag = ''
  if(newFlag) flag += `<div class="new | fw-bold">New!</div>`
  if(featuredFlag) flag += `<div class="featured | fw-bold">Featured</div>`
  return flag
}

/* adding a button for each language */
const createProgrammingLanguagesButton = (langs) => {
  let langButtons = ""
  langs.forEach(lang => {
    langButtons += `<li><button class="filter-button fw-bold filter">${lang}</button></li>`
  })
  return langButtons
}

/* adding a tool button for each tool */
const toolsButton = (tools) => {
  let toolCards = ""
  tools.forEach(tool => {
    toolCards += `<li><button class="filter-button fw-bold filter">${tool}</button></li>`
  })
  return toolCards
}

/*  */
const displaySearch = (e) => {
  let element = e.target
  if(element.classList.contains('filter')){
    searchContainer.classList.remove('hidden')
    displayFilter(element)
  }
}

let filterArray = []

const displayFilter = (ele) => {
  let filter = ""
  /* adding an element in filterArray */
  if(!filterArray.includes(ele.textContent)){
    filterArray.push(ele.textContent)
  }

  /* for each element in filter array we add this html */
  filterArray.forEach(element => {
    filter += `
    <div class="filtered-buttons">
        <button class="filtered-button fw-bold">${element}</button>
        <img class="remove remove-button" src="images/icon-remove.svg">
    </div>
    `
    searchFilters.innerHTML = filter
    addFilterJob()
  })
}

/* adding the filter jobs in HTML */
const addFilterJob = (data) => {
  if(filterArray.length !== 0){
    let cards = ""
    getData().then(data => {
      data.forEach(item => {
        if(filterJob(item)){
          cards += makeCards(item)
          jobsContainer.innerHTML = cards
        }
      })
    })
  }
  else {
    searchContainer.classList.add('hidden')
    addCards(data)
  }
}

/* Actually filtering the jobs */
const filterJob = (item) => {
  let isValid = true
  filterArray.forEach(elem => {
    if(item.role !== elem && item.level !== elem && !item.languages.includes(elem) && !item.tools.includes(elem)){
      isValid = false
    }
  })
  /* retorna "true" em todos os "joblists" que possuem o mesmo "botão" que você clicou */
  return isValid
}

/* removing the filtering */
const removeFilter = (e) => {
  let element = e.target
  if(element.classList.contains('remove')){
    const elementToRemove = element.parentElement
    let index = filterArray.indexOf(elementToRemove)
    filterArray.splice(index, 1)
    /* remove method removes the element from the DOM */
    elementToRemove.remove()
    addFilterJob()
  }
}

const clearSearch = () => {
  searchContainer.classList.add('hidden')
  filterArray = []
  addFilterJob()
}

jobsContainer.addEventListener('click', displaySearch)
searchFilters.addEventListener('click', removeFilter)
clear.addEventListener('click', clearSearch)