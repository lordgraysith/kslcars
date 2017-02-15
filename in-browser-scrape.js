let listings = [].slice.call(document.getElementsByClassName('listing'))
  .map(listing => Object.assign({}, {
    listing: listing,
    innerText: listing.innerText,
    href: listing.attributes['data-id'] && `http://www.ksl.com/auto/listing/${listing.attributes['data-id'].value}?ad_cid=50`
  }))
  .map(listing => Object.assign({}, listing,
    listing.innerText.split('\n')
  ))
  .map(listing => Object.assign({}, listing, {
    year: parseInt(/\d+/.exec(listing[1])[0]),
    price: parseInt(/\d+/.exec(listing[2].replace(/,/g, ''))),
    mileage: parseInt(/\d+/.exec(listing[3].replace(/,/g, ''))),
    isToyota: !!listing[1].match(/toyota/i)
  }))
  .map(listing => Object.assign(listing, {
    score: listing.isToyota ?
      (400000 - listing.mileage) / listing.price :
      (200000 - listing.mileage) / listing.price
  }))
  .sort((a, b) => b.score - a.score)
  .map(listing => Object.assign(listing, {
    link: document.createElement('a')
  }))
  .map(listing => {
    listing.link.href = listing.href
    listing.link.innerText = `${listing.score} - ${listing[1]}`
    return listing
  })
  .map(listing => {
    document.body.appendChild(document.createElement('br'))
    document.body.appendChild(listing.link)
    return listing
  })
