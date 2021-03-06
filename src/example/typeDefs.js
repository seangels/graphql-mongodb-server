// @flow

import gql from 'graphql-tag'

export default gql`
scalar JSON

type Image {
  src: String
  title: String
}

type ProductAttribute {
  key: String
  value: String
}

type Product {
  _id: ID
  id: String
  model: String
  sku: String
  slug: String
  name: String
  description: String
  body: String
  listPrice: Int
  salePrice: Int
  tags: [ProductTag]
  imageSrc: String
  category: ProductCategory
  categories: [ProductCategory]
  images: [Image]
  brands: [ProductBrand]
  attributes: [ProductAttribute]
}

type PagingInfo {
  sort: String
  page: Int
  limit: Int
  total: Int
  hasMore: Boolean
}

type ProductListResponse {
  entities: [Product]
  pagingInfo: PagingInfo
  error: JSON
  permission: PermissionResult
}

type PermissionResult {
  error: JSON,
  filter: JSON,
  projection: JSON
}
type ProductResponse {
  entity: Product
  error: JSON
}

# Product Category
type ProductCategory {
  _id: ID
  id: String
  slug: String
  name: String
  description: String
  isRoot: Boolean
  parent: ProductCategory
  children: [ProductCategory]
  brands: [ProductBrand]
}
type ProductCategoryListResponse {
  entities: [ProductCategory]
  pagingInfo: PagingInfo
  error: JSON
}

type ProductCategoryResponse {
  entity: ProductCategory
  error: JSON
}

# Product Tag
type ProductTag {
  _id: ID
  id: String
  slug: String
  name: String
  description: String
}

type ProductTagListResponse {
  entities: [ProductTag]
  pagingInfo: PagingInfo
  error: JSON
}

type ProductTagResponse {
  entity: ProductTag
  error: JSON
}

# Product Brand
type ProductBrand {
  _id: ID
  id: String
  slug: String
  name: String
  description: String
  website: String
}

type ProductBrandListResponse {
  entities: [ProductBrand]
  pagingInfo: PagingInfo
  error: JSON
}

type ProductBrandResponse {
  entity: ProductBrand
  error: JSON
}


# the schema allows the following query:
type Query {
  # List
  products(
    category: String, tag: String, brand: String
    sort: String, page: Int, limit: Int, actionCode: String
  ): ProductListResponse
  # Test overrideFilter
  restrictedProducts(
    category: String, tag: String, brand: String
    sort: String, page: Int, limit: Int
  ): ProductListResponse
  brands(sort: String, page: Int, limit: Int): ProductBrandListResponse
  categories(sort: String, page: Int, limit: Int): ProductCategoryListResponse
  tags(sort: String, page: Int, limit: Int): ProductTagListResponse

  # Detail
  product(
    slug: String,
    customFilterSlug: String,
  ): ProductResponse
  # Detail
  productWithPermission(
    params: JSON,
    actionCode: String
  ): ProductResponse
}

# we need to tell the server which types represent the root query
# and root mutation types. We call them RootQuery and RootMutation by convention.
schema {
  query: Query
}
`
