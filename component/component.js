/**
 * Created by Vea on 16/12/20 020.
 */

import widget from 'widget.mustache';

import dialog from './dialog.js';

import pages from './pages';
widget.tag('x-pages', pages);

export {
	dialog,
	pages,
}

//import table from './table';
//widget.tag('x-table', table);
