import Vue from "vue";
import toastr from "../../../core/toastr";
// import { LOAD, ADD, SELECT, CLEAR_SELECT, UPDATE, REMOVE } from "./types";
import { LOAD, LOAD_MORE, ADD, SELECT, CLEAR_SELECT, UPDATE, VOTE, UNVOTE, REMOVE, 
	NO_MORE_ITEMS, FETCHING, CHANGE_SORT, CHANGE_VIEWMODE } from "./types";
import Service from "../../../core/service";

export const NAMESPACE = "/api/users";

let service = new Service("users"); 

export const selectRow = ({ commit }, row, multiSelect) => {
	commit(SELECT, row, multiSelect);
};

export const clearSelection = ({ commit }) => {
	commit(CLEAR_SELECT);
};

export const downloadRows = function ({ commit }) {
	// commit(FETCHING, true);
	return service.rest("list", {}).then((data) => {
		if (data.length == 0)
			commit(NO_MORE_ITEMS);
		else
			commit(LOAD, data);
	}).catch((err) => {
		toastr.error(err.message);
	}).then(() => {
		commit(FETCHING, false);		
	});
};

// https://github.com/sw-yx/vue-express-mongo-boilerplate/pull/5#issuecomment-310967477
export const saveRow = function({ commit }, model) {
	service.rest("create", model).then((data) => {
		created({ commit }, data, true);
	}).catch((err) => {
		toastr.error(err.params.toastmessage);
	});
};

export const created = ({ commit }, row, needSelect) => {
	commit(ADD, row);
	if (needSelect)
		commit(SELECT, row, false);
};

export const updateRow = ({ commit }, row) => {
	service.rest(row.code, row).then((response) => {
		let res = response.data;
		if (res.data)
			commit(UPDATE, res.data);
	}).catch((err) => {
		toastr.error(err.params.toastmessage);
	});
};

export const updated = ({ commit }, row) => {
	commit(UPDATE, row);
};

//https://github.com/sw-yx/vue-express-mongo-boilerplate/pull/5#issuecomment-311987964
export const removeRow = function(store, model) {
	service.rest("remove", { code: model.code }).then((data) => {
		removed(store, data);
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const removed = ({ commit }, row) => {
	commit(REMOVE, row);
};
