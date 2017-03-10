'use strict';

import ready from 'ready';
import todo from './index'

ready(()=>{
	console.log('ready ok')
	new todo({el:'body'});

});