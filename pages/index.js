import Head from 'next/head'
import clientPromise from '../lib/mongodb'
// import properties from './api/properties'

export default function Home({ loadingData }) {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous" />
      </Head>

      <main className="row  text-center my-4">
        <h1 className="text-bold mb-5">TechStudio BnB</h1>

        <div className="row">
          {
            loadingData && loadingData.map(property => (
              <div className="col-sm-6 col-md-4 my-4" key={property.id}>
                <div className="card-group">
                  <div className="card">
                    <img src={property.image} className="card-img-top" height="200" width="auto" alt="..." />
                    <div className="card-body">
                      <h5 className="card-title">{property.name} <span className="text-danger">(Up to {property.guests} guests)</span></h5>
                      <p className="card-text overflow-auto">{property.summary}</p>
                      <p className="card-text">${property.price}/Night</p>

                      <div className="card-footer bg-transparent border-success">
                        <div className="d-grid gap-2">
                          <a href={"listing/" + property._id} className="btn btn-primary">Details</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>


      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  try {
    await clientPromise
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    const client = await clientPromise
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    const database = client.db('sample_airbnb')
    const data = await database.collection("listingsAndReviews").find({}).limit(30).toArray()

    const properties = JSON.parse(JSON.stringify(data));
    // console.log(properties);

    const filtered = properties.map(property => {
      const price = JSON.parse(JSON.stringify(property.price));
      return {
        id: property._id,
        name: property.name,
        image: property.images.picture_url,
        address: property.address,
        summary: property.summary,
        guests: property.accommodates,
        price: price.$numberDecimal
      }
    })

    console.log(filtered);
    return {
      props: { loadingData: filtered },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}
