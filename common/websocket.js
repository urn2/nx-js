

function fe(){}
/**
 *
 * @param host
 * @param role
 * @param id
 * @param open
 * @param message
 * @param close
 * @param error
 */
export default function(host='ws://192.168.31.102:10015', {role='guest', id=0}={}, {open=fe, message=fe, close=fe, error=fe}={}){
	let r={};
	r.from ={role, id};

	r.send =(type, data=false, {role=false, id=0}={})=>{
		let d={
			type:type,
			from_role:r.from.role,
			from_id:r.from.id,
		};
		if(data) d.content =data;
		if(role){
			d.to_role =role;
			if(id>0) d.to_id =id;
		}
		return r.socket.send(JSON.stringify(d));
	};


	r.socket =new WebSocket(host);
	r.socket.onopen =(e)=>{
		r.send('register');
		open(e);
	};
	r.socket.onmessage=(e)=>{
		var data=JSON.parse(e.data);
		message(e, data)
	};
	r.socket.onclose=close;
	r.socket.onerror=error;

	r.text=(content, to)=>r.send('text', content, to);
	r.change=(change={}, to)=>r.send('change', change, to);

	r.close=(code=1000, reason='')=>r.socket.close(code, reason);
	return r;
}

