/**
 * @fileOverview This file contains Tab object and along side with its
 *               functionalities, including drag, click, and render
 *
 * @author      David Dai
 * @author      Gary Chew
 * @author      Chau Vu
 * @author      Fernando Vazquez
 *
 * @requires    NPM: react, prop-types, uuid, react-bootstrap
 * @requires    ../styles/Tab.css
 */

import React from 'react';
import '../styles/Tab.css';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

/**
 * @description   A class to represent Tab components
 * @class
 */
class Tab extends React.Component {
  /**
   * @constructor
   *
   * @property  title:      the title of the website
   * @property  url:        the url of the website
   * @property  stored:     the location where this tab is currently attached
   * @property  favIconUrl: the url for the favicon
   */
  constructor(props) {
    super(props);
    Tab.propTypes = {
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      stored: PropTypes.string.isRequired,
      favIconUrl: PropTypes.string,
      groupName: PropTypes.string,
      removeTab: PropTypes.func,
    };
    /** if not defined, then those are the default properties */
    Tab.defaultProps = {
      favIconUrl: '',
      groupName: '',
      removeTab: () => {},
    };
  }

  /**
   * @description      Get the information when the tab start to be dragged
   * @param  {Tab} e   the tab that is being dragged
   */
  dragStart = (e) => {
    e.persist();
    /** pass information to drop in menu.jsx as JSON */
    const { title, url, favIconUrl, groupName, removeTab, stored } = this.props;
    const tabObj = {
      title,
      url,
      favIconUrl,
      groupName,
      removeTab,
      id: e.target.id,
      stored,
    };
    e.dataTransfer.setData('text', JSON.stringify(tabObj));
    /** to have the tab showing before dragged to a confirmed location */
    setTimeout(() => {
      e.target.style.display = 'always';
    }, 0);
  };

  /**
   *  @description       prevents propagation of the same event from being called
   *  @param   {Tab} e   the tab that is being dragged
   */
  dragOver = (e) => {
    e.stopPropagation();
  };

  /**
   * @description           Open the link url attached to the Tab
   * @param {string} link   the url of the Tab
   */
  openTab = (link) => {
    /** opens the link in a new window */
    window.open(link, '_blank');
  };

  /**
   * @description             Get the host / domain of from the link
   * @param {string} link     The link being passed in to find the website
   * @returns {string|null|*} the website's host / domain
   */
  getWebsite = (link) => {
    if (!link) return null;
    const path = link.split('/');
    const protocol = path[0];
    const host = path[2];
    /** case 1 the link start with www */
    if (host.search('www.') !== -1) {
      return host.substr(host.search('www.') + 4);
    }
    /** case 2 the link contains https */
    if (protocol.search('https') === -1) {
      return `${protocol}//${host}`;
    }
    return host;
  };

  /**
   * @description           Render the tool tip
   * @param {string} title  The title of the website
   * @param {string} url    The url of the website
   * @returns {*}
   */
  renderTooltip(title, url) {
    return (
      <Tooltip id="button-tooltip">
        <b>{title}</b>
        <br />
        {this.getWebsite(url)}
      </Tooltip>
    );
  }

  /**
   * @description   How the Tab is rendered
   * @returns {*}
   */
  render() {
    /** add the following to props
     * title: the title of webiste stored in the tab
     * url: the link of the website
     * favIconUrl: the favIcon of the website
     * groupName: the place where the tab is stored
     * removeTab: function to remove the tab
     * */
    const { title, url, favIconUrl, groupName, removeTab } = this.props;
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus
      <OverlayTrigger
        placement="bottom"
        overlay={this.renderTooltip(title, url)}
      >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus */}
        <div
          id={uuid()} /** find element by id, so each id need to be different */
          role="button"
          className="tabContainer"
          draggable="true" /** for the drag-drop to know */
          key={url} /** because each url is different so we set it to be key */
          onDragStart={this.dragStart}
          onDragOver={this.dragOver}
          data-testid="tab-container" /** for testing */
        >
          <p className="tabTitle" onClick={() => this.openTab(url)}>
            {favIconUrl !== '' && (
              <img
                className="tabFavIcon"
                src={favIconUrl}
                alt="favicon"
                height="16"
                width="16"
              />
            )}
            {title}
          </p>
          <div
            className="closeButton"
            onClick={() => removeTab(groupName, url)}
          >
            {groupName !== '' && <p>x</p>}
          </div>
        </div>
      </OverlayTrigger>
    );
  }
}

export default Tab;
