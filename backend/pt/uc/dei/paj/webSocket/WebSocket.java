package pt.uc.dei.paj.webSocket;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.json.JSONObject;

import pt.uc.dei.paj.dao.DAOUser;
import pt.uc.dei.paj.entity.Type;
import pt.uc.dei.paj.entity.User;
import pt.uc.dei.paj.service.AdminService;
@ServerEndpoint(value="/adminInfo/{username}")
public class WebSocket {
	
	@Inject
	AdminService adminService;
	@Inject
	DAOUser userDao;
	
	private static final Logger logger = Logger.getLogger(WebSocket.class.getName());

		public static void send(Session session,String message) {

			try {

					session.getBasicRemote().sendText(message);
					logger.log(Level.INFO, "Sent: {0}", message);
		
			} catch (IOException e) {
				logger.log(Level.INFO, e.toString());
			}
		}
		
		@OnMessage
		public void textMessage(Session session, String msg, @PathParam("username") String username) {
			
			JSONObject obj = new JSONObject(msg);
			
			String token = obj.getString("token");	
			
			User user = userDao.findUserByToken(token);
			
			session.getUserProperties().put("token", token);
			
			if(session.getUserProperties().get("username").equals(username)) {

				if(user.getUsername().equals(username) && user.getType().equals(Type.admin)) {

					//adminService.uniteAllDashInfo();
				}
			}
			
			if(obj.has("usernameToChange") && obj.has("action")) {
				String usernameToChange = obj.getString("usernameToChange");
				String action = obj.getString("action");
				
				if(action.equals("DELETE")) {
					
					adminService.deleteUser(usernameToChange);
					
				} else if(action.equals("UPGRADE")) {
					
					adminService.upgradeToMember(usernameToChange);
					
				}
			}
		}

		@OnOpen
		public void openConnection(Session session,  @PathParam("username") String username) {
			
			logger.log(Level.INFO, "Connection opened.");
			
			adminService.addSession(username, session);
		}

		@OnClose
		public void closedConnection(Session session) {
			
			logger.log(Level.INFO, "Connection closed.");
			
			adminService.removeSession(session);
		}

		@OnError
		public void error(Session session, Throwable t) {
			
			logger.log(Level.INFO, t.toString());
			logger.log(Level.INFO, "Connection error.");
			
			adminService.removeSession(session);
		}
}
