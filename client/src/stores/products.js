import { observable, action, computed, extendObservable } from 'mobx';
import api from 'api';

export class Product {
  @observable id;
  @observable name;
  @observable price;
  @observable brand = {}
  @observable images = []

  @computed
  get mainImage() {
    return this.images[0];
  }
}


export default class Products {
  @observable isLoading = false;
  @observable entities = [];
  @observable brands = [
    {
      name: 'Asics',
      code: 'asics'
    },
    {
      name: 'New Balance',
      code: 'new-balance'
    },
    {
      name: 'Nike',
      code: 'nike'
    }
  ]
  @observable sizes = [45, 46, 47, 48, 49, 50]
  @observable productDetails = {
    id: '',
    name: '',
    price: 0,
    brand: {},
    images: [],
    sizes: []
  };
  @observable filters = {
    brand: observable.map(),
    size: observable.map(),
  }
  @computed
  get filteredProducts() {
    return this.entities.filter(
      entity => {
        const isBrand = this._setFilter('brand', entity.brand.code);
        const isSize = this._filterSizes(entity.sizes);

        return isSize && isBrand;
      }
    )
  }

  @action.bound
  async getProducts() {
    this.isLoading = true;
    const res = await api.products.getAll();
    this.entities = res.data;
    this.isLoading = false;
  }

  @action.bound
  async getOne(id) {
    const res = await api.products.getOne(id);
    console.log('res.data', res.data)
    this.productDetails = res.data
    // extendObservable(this.productDetails, res.data)

  }

  @action.bound
  toggleFilter(name, value) {
    const filter = this.filters[name];
    if (filter.has(value)) {
      filter.delete(value)
    } else {
      filter.set(value, true)
    }
  }

  @action.bound
  resetFilter(name) {
    const filter = this.filters[name];
    filter.clear();
  }

  _setFilter(name, value) {
    const filter = this.filters[name];
    return (filter.size === 0) ? true : filter.has(value)
  }

  _filterSizes(sizes) {
    let isSize;
    if (sizes.length) {
      //if size in size's filter
      isSize = sizes.some((size) => {
        return this._setFilter('size', size);
      })
    } else {
      //if size's filter is empty return true
      isSize = !this.filters.size.size
    }
    return isSize;
  }

}
