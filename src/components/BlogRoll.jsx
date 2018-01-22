/* @flow */

import React from 'react'
import dateFormat from 'dateformat'
import get from 'lodash/get'
import Link from 'gatsby-link'
import updates from '../pages/about/updates/updates.yaml'
import Async from 'react-promise'

const _sortUpdates = updates => {
  const filtered = updates.filter(u => u.date)

  const sorted = filtered.sort(function (a, b) {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateA > dateB ? 1 : -1
  }).reverse()

  return sorted
}

type tPROPS = {
  small: boolean
};

/**
 * @description [reverse chron list of blog posts for home and /updates/]
 */
const BlogRoll = (props: tPROPS) => {
  const {
    small
  } = props

  // filter out posts without a valid date
  // and also sort them reverse chron
  const sortedUpdates: Array<Object> = _sortUpdates(updates.updates)

  // increment for every actually rendered post
  // this is useful because not everything in
  // sortedPosts will get rendered. actually,
  // most won't get rendered, since posts
  // are really just any docs file
  let tally: number = 0 | 0

  return (
    <section className='blog-bg body-bg-offwhite'>
      <h2 className="center-heading" style={{margin: '30px 30px 10px'}}><span>Latest News & Updates</span></h2>
      <ul
        aria-label='openFDA updates'
        tabIndex={0}
        className={'container blog-container ' + (small === true ?  'overflow-hidden small-blog-container' : '')}>
        {
          sortedUpdates.map((update: Object, i: number) => {
            const {
              desc,
              date
            } = update

            let title = new Promise(function(resolve, reject){
              if (update.title.length > 40) {
                resolve((get(update, 'title')).substring(0, 40) + '...')
              } else {
                resolve(update.title)
              }
            })

            // level refers to header level. h1, h2, etc
            // we start at 2, because h1 is the hero section
            // and then we proceed from there
            // we do this so we have a logical order of headers
            // h1 -> h2 -> h3 and so on til we get to h6
            let level: number = tally === 0 ? 2 : (tally + 2)
            // cheap way to keep capped at h6
            if (level > 6) {
              level = 6
            }

            // don't remove me
            // i keep track of the amount
            // of actually rendered blog posts
            tally += 1


            // Post date, if available
            let formattedDate = ''
            if (date.length > 0) {
              formattedDate = dateFormat(date, 'mmmm d, yyyy').toUpperCase()
            }

            return (
              <li
                key={i}
                className='marg-l-1 marg-r-1 marg-t-2 marg-b-2 blog-item'>
                <Link className='pad-3 relative full-height blog-text-item' style={{paddingTop: "30px"}}to={update.path}>
                  <Async promise={title} then={(val) => <h2 className='blog-header clr-primary-darker'>{val}</h2>}/>
                  <div className='clr-gray-light marg-b-1 t-marg-t-05 time-stamp'>{formattedDate}</div>
                  <p className="smallest txt-overflow-ellipsis">{desc}</p>
                  <span className="absolute bottom pad-b-2 weight-700 clr-primary">READ MORE <i className="fa fa-angle-right"/></span>
                </Link>
              </li>
            )
          })
        }
      </ul>
      {small === true &&
        <Link
        className='btn-icon-right pad-b-3 weight-700 clr-primary'
        to='/about/updates/'>
        VIEW ALL <i className="fa fa-angle-right"/>
        </Link>}
    </section>
  )
}

BlogRoll.displayName = 'component/BlogRoll'
export default BlogRoll