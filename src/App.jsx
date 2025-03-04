
import { useState, useEffect } from 'react';
import axios from 'axios';

/*
  Загрузить список персонажей с сервера https://rickandmortyapi.com/api/character
  Вывести списком в столбик картоки с данными персонажей (бекграунд #3c3e44)
  Сделать пейджер, который листает список персонажей
  Сделать фильтр, который позволяет искать персонажа по имени и статусу
  Вывести логотип в header
*/
/*
  "name": "Rick Sanchez",
  "status": "Alive",
  "species": "Human",
  "type": "",
  "gender": "Male",
*/

/*
Alive, Dead, Unknown
Human, Alien, Humanoid, Animal, Robot, Poopybutthole, Mythological Creature, Cronenberg, Disease, unknown
male, female, genderless, unknown
*/

export default function App() {
  const [pers, setPers] = useState([]);
  const [info, setInfo] = useState({});
  const [filter, setFilter] = useState({});
  const [pages, setPages] = useState([]);

  useEffect(search, [filter]);

  function search() {
    axios.get('https://rickandmortyapi.com/api/character', { params: { ...filter } })
      .then(resp => {
        setPers(resp.data.results);
        setInfo(resp.data.info);
        setPages(getPages(resp.data.info.pages))
      })
  }

  function getPages(total) {
    let pages = []
    if (total != null) {
      pages = Array.from({ length: total }, (_, i) => i + 1);
    }
    return pages;
  };

  function pageHandler(page) {
    if (page < 1) page = 1;
    if (page > info.pages) page = info.pages;
    handleFilter('page', page);
  };

  function handleFilter(field, value) {
    setFilter(prev => ({ ...prev, ...{ [field]: value } }))
  }

  return (
    <main>
      <header />
      <div className='cards'>
        <div className='cards-title'>Персонажи</div>
        <div className='cards-filter'>
          <div className='cards-filter-item'>
            <label>Name</label>
            <input className='form-control' onInput={e => handleFilter('name', e.currentTarget.value)} />
          </div>
          <div className='cards-filter-item'>
            <label>Type</label>
            <input className='form-control' onInput={e => handleFilter('type', e.currentTarget.value)} />
          </div>
          <div className='cards-filter-item'>
            <label>Status</label>
            <select className='form-control' onChange={e => handleFilter('status', e.currentTarget.value)}>
              <option value=''>Any</option>
              <option value='Alive'>Alive</option>
              <option value='Dead'>Dead</option>
              <option value='Unknown'>Unknown</option>
            </select>
          </div>
          <div className='cards-filter-item'>
            <label>Species</label>
            <select className='form-control' onChange={e => handleFilter('species', e.currentTarget.value)}>
              <option value=''>Any</option>
              <option value='Human'>Human</option>
              <option value='Alien'>Alien</option>
              <option value='Humanoid'>Humanoid</option>
              <option value='unknown'>Unknown</option>
              <option value='Poopybutthole'>Poopybutthole</option>
              <option value='Mythological Creature'>Mythological Creature</option>
              <option value='Animal'>Animal</option>
              <option value='Robot'>Robot</option>
              <option value='Cronenberg'>Cronenberg</option>
              <option value='Disease'>Disease</option>
            </select>
          </div>
          <div className='cards-filter-item'>
            <label>Gender</label>
            <select className='form-control' onChange={e => handleFilter('gender', e.currentTarget.value)}>
              <option value=''>Any</option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
              <option value='genderless'>Genderless</option>
              <option value='unknown'>Unknown</option>
            </select>
          </div>
          <div className='cards-filter-item'>
            <button className='btn btn-primary' onClick={search}>Поиск</button>
          </div>
        </div>
        <div className={'cards-box'}>
          {
            pers.map(x => (
              <div className='card-box' key={x.id}>
                <img src={x.image} alt={x.name} />
                <div className='card-info'>
                  <div className='card-name'>{x.name}</div>
                  {
                    x.type &&
                    <div className='card-status'>Type: {x.type}</div>
                  }
                  <div className='card-status'>Status: {x.status} <span className={`card-status-icon ${x.status.toLowerCase()}`} /></div>
                  <div className='card-status'>Species: {x.species}</div>
                </div>
              </div>
            ))
          }
        </div>
        <div className='pages'>
          <div className='page' onClick={() => pageHandler(filter.page - 1)}>{'<<'}</div>
          {
            pages.map(p => (
              <div key={p} className={`page ${p == filter.page ? 'active' : ''}`} onClick={() => pageHandler(p)}>
                {p}
              </div>))
          }
          <div className='page' onClick={() => pageHandler(filter.page + 1)}>{'>>'}</div>
        </div>
      </div>
    </main>
  )
}
